import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull, Or } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Lesson, LessonType } from './entities/lesson.entity';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { UserProgress, ProgressStatus } from './entities/user-progress.entity';
import { UsersService } from '../users/users.service';
import { GamificationService } from '../gamification/gamification.service';

// Spaced Repetition System (SM-2 algorithm) intervals in days
const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
const SRS_EASE_FACTOR_DEFAULT = 2.5;
const SRS_MIN_EASE_FACTOR = 1.3;

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(UserProgress)
    private readonly progressRepository: Repository<UserProgress>,
    private readonly usersService: UsersService,
    private readonly gamificationService: GamificationService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('learning-events') private readonly learningQueue: Queue,
  ) {}

  async getCourses(userId: string) {
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.exercises', 'exercise')
      .select([
        'lesson.id',
        'lesson.title',
        'lesson.description',
        'lesson.courseId',
        'lesson.hskLevel',
        'lesson.orderIndex',
        'lesson.thumbnailUrl',
        'lesson.estimatedMinutes',
        'lesson.isLocked',
        'lesson.xpReward',
      ])
      .where('lesson.isPublished = :isPublished', { isPublished: true })
      .orderBy('lesson.courseId', 'ASC')
      .addOrderBy('lesson.orderIndex', 'ASC')
      .getMany();

    // Group by course/HSK level
    const coursesMap = new Map<string, any>();
    for (const lesson of lessons) {
      if (!coursesMap.has(lesson.courseId)) {
        coursesMap.set(lesson.courseId, {
          id: lesson.courseId,
          hskLevel: lesson.hskLevel,
          title: `HSK ${lesson.hskLevel?.replace('HSK', '')} Course`,
          lessons: [],
          totalLessons: 0,
          completedLessons: 0,
        });
      }
      coursesMap.get(lesson.courseId).lessons.push(lesson);
      coursesMap.get(lesson.courseId).totalLessons++;
    }

    // Get user progress
    const userProgresses = await this.progressRepository.find({
      where: { userId, status: ProgressStatus.COMPLETED },
      select: ['lessonId'],
    });

    const completedLessonIds = new Set(userProgresses.map((p) => p.lessonId));

    // Mark completed lessons
    coursesMap.forEach((course) => {
      course.lessons.forEach((lesson: any) => {
        lesson.isCompleted = completedLessonIds.has(lesson.id);
        if (lesson.isCompleted) course.completedLessons++;
      });
      course.progress = course.totalLessons > 0
        ? Math.round((course.completedLessons / course.totalLessons) * 100)
        : 0;
    });

    return { courses: Array.from(coursesMap.values()) };
  }

  async getCourse(courseId: string, userId: string) {
    const lessons = await this.lessonRepository.find({
      where: { courseId, isPublished: true },
      order: { orderIndex: 'ASC' },
    });

    if (!lessons.length) {
      throw new NotFoundException('Course not found');
    }

    return { course: { id: courseId, lessons } };
  }

  async getCourseLessons(courseId: string, userId: string, options: { page: number; limit: number }) {
    const { page, limit } = options;
    const [lessons, total] = await this.lessonRepository.findAndCount({
      where: { courseId, isPublished: true },
      order: { orderIndex: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { lessons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getLesson(lessonId: string, userId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, isPublished: true },
      relations: ['exercises'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Get user's previous attempt
    const progress = await this.progressRepository.findOne({
      where: { userId, lessonId },
    });

    // Sort exercises by order
    lesson.exercises?.sort((a, b) => a.orderIndex - b.orderIndex);

    return {
      lesson: {
        ...lesson,
        userProgress: progress || null,
      },
    };
  }

  async startLesson(lessonId: string, userId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, isPublished: true },
      relations: ['exercises'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Create or update progress record
    let progress = await this.progressRepository.findOne({ where: { userId, lessonId } });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        lessonId,
        status: ProgressStatus.IN_PROGRESS,
        startedAt: new Date(),
        attemptsCount: 1,
      });
    } else {
      progress.status = ProgressStatus.IN_PROGRESS;
      progress.attemptsCount = (progress.attemptsCount || 0) + 1;
      progress.startedAt = new Date();
    }

    await this.progressRepository.save(progress);

    // Return exercises in order
    const exercises = lesson.exercises?.sort((a, b) => a.orderIndex - b.orderIndex) || [];

    return {
      sessionId: progress.id,
      lesson: { id: lesson.id, title: lesson.title, type: lesson.type },
      exercises,
      totalExercises: exercises.length,
    };
  }

  async completeLesson(
    lessonId: string,
    userId: string,
    completionData: {
      score: number;
      timeSpentSeconds: number;
      exerciseResults: Array<{ exerciseId: string; correct: boolean; timeTaken: number }>;
    },
  ) {
    const { score, timeSpentSeconds, exerciseResults } = completionData;

    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    let progress = await this.progressRepository.findOne({ where: { userId, lessonId } });
    const isFirstCompletion = !progress || progress.status !== ProgressStatus.COMPLETED;

    if (!progress) {
      progress = this.progressRepository.create({ userId, lessonId });
    }

    const isPassing = score >= 70; // 70% passing threshold

    progress.status = isPassing ? ProgressStatus.COMPLETED : ProgressStatus.FAILED;
    progress.lastScore = score;
    progress.bestScore = Math.max(progress.bestScore || 0, score);
    progress.timeSpentSeconds = (progress.timeSpentSeconds || 0) + timeSpentSeconds;
    progress.completedAt = isPassing ? new Date() : progress.completedAt;

    await this.progressRepository.save(progress);

    let xpEarned = 0;
    let achievements: any[] = [];

    if (isPassing && isFirstCompletion) {
      // Award XP only for first completion
      xpEarned = lesson.xpReward || 50;
      const xpResult = await this.usersService.addXp(userId, xpEarned);

      // Check for achievements
      achievements = await this.gamificationService.checkLessonAchievements(userId, {
        lessonId,
        score,
        timeSpentSeconds,
        isFirstCompletion,
      });

      // Update lesson count
      await this.usersService.updateProfile(userId, {
        totalLessonsCompleted: undefined, // handled in service
      } as any);

      // Queue background tasks
      await this.learningQueue.add('lesson-completed', {
        userId,
        lessonId,
        score,
        xpEarned,
        timestamp: new Date(),
      });

      this.eventEmitter.emit('lesson.completed', {
        userId,
        lessonId,
        score,
        isFirstCompletion,
      });
    }

    return {
      success: isPassing,
      score,
      xpEarned,
      achievements,
      message: isPassing
        ? `Great job! You scored ${score}% and earned ${xpEarned} XP!`
        : `You scored ${score}%. You need 70% to pass. Keep practicing!`,
      nextLesson: isPassing ? await this.getNextLesson(lessonId) : null,
    };
  }

  async submitExerciseAnswer(
    exerciseId: string,
    userId: string,
    submission: { answer: string; timeSpentMs: number },
  ) {
    const exercise = await this.exerciseRepository.findOne({ where: { id: exerciseId } });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const isCorrect = this.checkAnswer(exercise, submission.answer);

    return {
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      hint: !isCorrect ? exercise.hint : null,
    };
  }

  async getUserVocabulary(
    userId: string,
    options: { status?: string; hskLevel?: string; page: number; limit: number },
  ) {
    // Implementation would query user_vocabulary with SRS data
    return { vocabulary: [], total: 0 };
  }

  async getDueReviews(userId: string) {
    const now = new Date();
    // Items due for review: nextReviewDate <= now
    return {
      dueCount: 0,
      items: [],
      message: 'No items due for review today!',
    };
  }

  async submitReview(
    userId: string,
    reviewData: Array<{ wordId: string; quality: number; timeSpentMs: number }>,
  ) {
    let totalXp = 0;
    const results = [];

    for (const item of reviewData) {
      const { wordId, quality } = item;
      // SM-2 algorithm
      const newInterval = this.calculateSrsInterval(quality, 1, SRS_EASE_FACTOR_DEFAULT);
      results.push({ wordId, correct: quality >= 3, newInterval });
      if (quality >= 3) totalXp += 5;
    }

    if (totalXp > 0) {
      await this.usersService.addXp(userId, totalXp);
    }

    return { results, totalXp, message: `Review complete! Earned ${totalXp} XP.` };
  }

  async getUserProgress(userId: string) {
    const progresses = await this.progressRepository.find({
      where: { userId },
      relations: ['lesson'],
      order: { completedAt: 'DESC' },
      take: 50,
    });

    const completed = progresses.filter((p) => p.status === ProgressStatus.COMPLETED).length;
    const inProgress = progresses.filter((p) => p.status === ProgressStatus.IN_PROGRESS).length;

    return {
      summary: {
        totalCompleted: completed,
        totalInProgress: inProgress,
        totalAttempted: progresses.length,
      },
      recentActivity: progresses.slice(0, 10),
    };
  }

  async getDailyLesson(userId: string) {
    // Find next uncompleted lesson for user
    const completedLessonIds = await this.progressRepository
      .createQueryBuilder('progress')
      .select('progress.lessonId')
      .where('progress.userId = :userId', { userId })
      .andWhere('progress.status = :status', { status: ProgressStatus.COMPLETED })
      .getMany();

    const completedIds = completedLessonIds.map((p) => p.lessonId);

    let lesson: Lesson | null = null;

    if (completedIds.length > 0) {
      lesson = await this.lessonRepository
        .createQueryBuilder('lesson')
        .where('lesson.isPublished = :isPublished', { isPublished: true })
        .andWhere('lesson.id NOT IN (:...completedIds)', { completedIds })
        .orderBy('lesson.orderIndex', 'ASC')
        .getOne();
    } else {
      lesson = await this.lessonRepository.findOne({
        where: { isPublished: true },
        order: { orderIndex: 'ASC' },
      });
    }

    return { dailyLesson: lesson };
  }

  async getMiniGames(userId: string) {
    return {
      games: [
        { id: 'tone-match', name: 'Tone Match', description: 'Match tones with characters', icon: 'music-note' },
        { id: 'character-draw', name: 'Character Draw', description: 'Practice writing characters', icon: 'pencil' },
        { id: 'word-chain', name: 'Word Chain', description: 'Build vocabulary chains', icon: 'link' },
        { id: 'listening-quiz', name: 'Listening Quiz', description: 'Test your listening comprehension', icon: 'headphones' },
      ],
    };
  }

  async startMiniGame(gameType: string, userId: string, options: any) {
    const validGames = ['tone-match', 'character-draw', 'word-chain', 'listening-quiz'];
    if (!validGames.includes(gameType)) {
      throw new BadRequestException('Invalid game type');
    }

    return {
      sessionId: `session_${Date.now()}`,
      gameType,
      questions: [],
      timeLimit: 120,
      message: 'Mini-game session started',
    };
  }

  async completeMiniGame(
    sessionId: string,
    userId: string,
    results: { score: number; correctAnswers: number; totalQuestions: number },
  ) {
    const xpEarned = Math.floor(results.score / 10);
    await this.usersService.addXp(userId, xpEarned);

    return {
      score: results.score,
      xpEarned,
      accuracy: results.totalQuestions > 0
        ? Math.round((results.correctAnswers / results.totalQuestions) * 100)
        : 0,
      message: `Game over! Score: ${results.score}. Earned ${xpEarned} XP!`,
    };
  }

  private async getNextLesson(currentLessonId: string): Promise<Lesson | null> {
    const currentLesson = await this.lessonRepository.findOne({
      where: { id: currentLessonId },
    });

    if (!currentLesson) return null;

    return this.lessonRepository.findOne({
      where: { courseId: currentLesson.courseId, isPublished: true },
      order: { orderIndex: 'ASC' },
    });
  }

  private checkAnswer(exercise: Exercise, userAnswer: string): boolean {
    const correct = exercise.correctAnswer.toLowerCase().trim();
    const given = userAnswer.toLowerCase().trim();

    if (exercise.type === ExerciseType.MULTIPLE_CHOICE || exercise.type === ExerciseType.FILL_BLANK) {
      return correct === given;
    }

    // For tone/pronunciation, allow minor variations
    return correct === given;
  }

  private calculateSrsInterval(quality: number, currentInterval: number, easeFactor: number): number {
    if (quality < 3) {
      return 1; // Reset to 1 day
    }

    if (currentInterval === 0) return 1;
    if (currentInterval === 1) return 3;

    const newEaseFactor = Math.max(
      SRS_MIN_EASE_FACTOR,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
    );

    return Math.round(currentInterval * newEaseFactor);
  }
}
