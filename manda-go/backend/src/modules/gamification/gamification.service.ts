import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Streak } from './entities/streak.entity';
import { Achievement } from './entities/achievement.entity';
import { User } from '../users/entities/user.entity';

export interface XpAwardResult {
  userId: string;
  xpEarned: number;
  totalXp: number;
  newLevel: number;
  leveledUp: boolean;
}

export interface StreakUpdateResult {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
  shieldConsumed: boolean;
  streakBroken: boolean;
}

export interface AchievementEarned {
  achievement: Achievement;
  earnedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  currentStreak: number;
}

export interface UserGamificationStats {
  userId: string;
  totalXp: number;
  level: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  streakShields: number;
  totalLessonsCompleted: number;
  vocabularyLearned: number;
  achievements: Achievement[];
  recentAchievements: Achievement[];
}

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  // XP thresholds per level: level n requires floor(100 * n^1.5) cumulative XP
  private readonly XP_PER_LEVEL_EXPONENT = 1.5;
  private readonly XP_BASE = 100;

  constructor(
    @InjectRepository(Streak)
    private readonly streakRepository: Repository<Streak>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // -----------------------------------------------------------------------
  // XP
  // -----------------------------------------------------------------------

  /**
   * Awards XP to a user, recalculates level, and emits events.
   */
  async awardXP(userId: string, amount: number): Promise<XpAwardResult> {
    if (amount <= 0) {
      throw new BadRequestException('XP amount must be positive');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const previousLevel = user.level;
    const newTotalXp = user.totalXp + amount;
    const newLevel = this.calculateLevel(newTotalXp);
    const leveledUp = newLevel > previousLevel;

    await this.userRepository.update(userId, {
      totalXp: newTotalXp,
      level: newLevel,
      lastActivityDate: new Date(),
    });

    const result: XpAwardResult = {
      userId,
      xpEarned: amount,
      totalXp: newTotalXp,
      newLevel,
      leveledUp,
    };

    this.eventEmitter.emit('user.xp.awarded', result);

    if (leveledUp) {
      this.logger.log(`User ${userId} leveled up: ${previousLevel} → ${newLevel}`);
      this.eventEmitter.emit('user.level.up', { userId, previousLevel, newLevel });
    }

    // Trigger achievement check for XP milestones
    await this.checkAchievements(userId, 'xp', newTotalXp);

    return result;
  }

  // -----------------------------------------------------------------------
  // Streak
  // -----------------------------------------------------------------------

  /**
   * Updates the user's streak based on today's activity.
   * Handles shield consumption when a day is missed.
   */
  async updateStreak(userId: string): Promise<StreakUpdateResult> {
    let streak = await this.streakRepository.findOne({ where: { userId } });

    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        streakShields: 0,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = this.getDateString(-1);

    let isNewDay = false;
    let shieldConsumed = false;
    let streakBroken = false;

    if (streak.lastActivityDate === today) {
      // Already logged today — no change
      return {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        isNewDay: false,
        shieldConsumed: false,
        streakBroken: false,
      };
    }

    isNewDay = true;

    if (!streak.lastActivityDate || streak.lastActivityDate === yesterday) {
      // Consecutive day or first ever activity
      streak.currentStreak += 1;
    } else {
      // Missed at least one day — check for shield
      const daysMissed = this.daysBetween(streak.lastActivityDate, today);

      if (daysMissed === 2 && streak.streakShields > 0 && !streak.shieldUsedToday) {
        // Exactly one day missed, consume a shield to bridge the gap
        streak.streakShields -= 1;
        streak.shieldUsedToday = true;
        streak.shieldUsedDate = yesterday;
        streak.currentStreak += 1;
        shieldConsumed = true;
        this.logger.log(`Shield consumed for user ${userId}`);
      } else {
        // Streak broken
        streak.currentStreak = 1;
        streak.shieldUsedToday = false;
        streakBroken = true;
      }
    }

    streak.lastActivityDate = today;
    streak.totalActiveDays += 1;

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    await this.streakRepository.save(streak);

    // Mirror to user table for fast leaderboard queries
    await this.userRepository.update(userId, {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: new Date(),
    });

    const result: StreakUpdateResult = {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isNewDay,
      shieldConsumed,
      streakBroken,
    };

    this.eventEmitter.emit('user.streak.updated', { userId, ...result });

    // Check streak achievements
    await this.checkAchievements(userId, 'streak', streak.currentStreak);

    return result;
  }

  // -----------------------------------------------------------------------
  // Achievements
  // -----------------------------------------------------------------------

  /**
   * Checks all achievements matching the given event type and awards any
   * unlocked achievements that the user doesn't already hold.
   */
  async checkAchievements(
    userId: string,
    event: string,
    value: number,
  ): Promise<AchievementEarned[]> {
    const conditionMap: Record<string, string> = {
      streak: 'streak_days',
      xp: 'total_xp',
      lessons: 'lessons_completed',
      vocabulary: 'vocabulary_learned',
    };

    const conditionType = conditionMap[event];
    if (!conditionType) return [];

    const candidates = await this.achievementRepository
      .createQueryBuilder('a')
      .where('a.conditionType = :conditionType', { conditionType })
      .andWhere('a.conditionValue <= :value', { value })
      .getMany();

    if (!candidates.length) return [];

    // Fetch already-earned achievements from the user record (stored in settings.achievements)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'settings'],
    });

    if (!user) return [];

    const earnedIds: string[] = Array.isArray(user.settings?.earnedAchievements)
      ? user.settings.earnedAchievements
      : [];

    const newlyEarned: AchievementEarned[] = [];

    for (const achievement of candidates) {
      if (earnedIds.includes(achievement.id)) continue;

      earnedIds.push(achievement.id);
      newlyEarned.push({ achievement, earnedAt: new Date() });

      this.logger.log(`Achievement earned: ${achievement.name} by user ${userId}`);
    }

    if (newlyEarned.length > 0) {
      // Persist earned list back to user.settings
      await this.userRepository.update(userId, {
        settings: { ...user.settings, earnedAchievements: earnedIds },
      });

      // Award XP for each new achievement
      for (const earned of newlyEarned) {
        if (earned.achievement.xpReward > 0) {
          await this.userRepository.increment(
            { id: userId },
            'totalXp',
            earned.achievement.xpReward,
          );
        }
        this.eventEmitter.emit('user.achievement.earned', {
          userId,
          achievement: earned.achievement,
          earnedAt: earned.earnedAt,
        });
      }
    }

    return newlyEarned;
  }

  /**
   * Checks lesson-specific achievements (called from LearningService).
   */
  async checkLessonAchievements(
    userId: string,
    data: {
      lessonId: string;
      score: number;
      timeSpentSeconds: number;
      isFirstCompletion: boolean;
    },
  ): Promise<AchievementEarned[]> {
    if (!data.isFirstCompletion) return [];

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return [];

    const results: AchievementEarned[] = [];

    // Perfect score check
    if (data.score === 100) {
      const perfectAchievements = await this.checkAchievements(userId, 'perfect', data.score);
      results.push(...perfectAchievements);
    }

    // Lessons count check
    const lessonsResult = await this.checkAchievements(
      userId,
      'lessons',
      user.totalLessonsCompleted + 1,
    );
    results.push(...lessonsResult);

    return results;
  }

  // -----------------------------------------------------------------------
  // Leaderboard
  // -----------------------------------------------------------------------

  /**
   * Returns the top 30 users by XP for a given league/season.
   * League and season parameters are reserved for future use.
   */
  async getLeaderboard(
    leagueId?: string,
    seasonId?: string,
  ): Promise<LeaderboardEntry[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.avatarUrl',
        'user.totalXp',
        'user.level',
        'user.currentStreak',
      ])
      .where('user.isActive = :isActive', { isActive: true })
      .orderBy('user.totalXp', 'DESC')
      .take(30)
      .getMany();

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      displayName: `${user.firstName} ${user.lastName}`.trim(),
      avatarUrl: user.avatarUrl ?? null,
      xp: user.totalXp,
      level: user.level,
      currentStreak: user.currentStreak,
    }));
  }

  // -----------------------------------------------------------------------
  // User Stats
  // -----------------------------------------------------------------------

  /**
   * Returns full gamification stats for a user (dashboard use-case).
   */
  async getUserStats(userId: string): Promise<UserGamificationStats> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const streak = await this.streakRepository.findOne({ where: { userId } });

    const earnedIds: string[] = Array.isArray(user.settings?.earnedAchievements)
      ? user.settings.earnedAchievements
      : [];

    let achievements: Achievement[] = [];
    let recentAchievements: Achievement[] = [];

    if (earnedIds.length > 0) {
      achievements = await this.achievementRepository
        .createQueryBuilder('a')
        .whereInIds(earnedIds)
        .getMany();

      // Sort by conditionValue desc to approximate "recently earned"
      recentAchievements = [...achievements]
        .sort((a, b) => b.conditionValue - a.conditionValue)
        .slice(0, 5);
    }

    const xpToNextLevel = this.xpRequiredForLevel(user.level + 1) - user.totalXp;

    return {
      userId,
      totalXp: user.totalXp,
      level: user.level,
      xpToNextLevel: Math.max(0, xpToNextLevel),
      currentStreak: streak?.currentStreak ?? user.currentStreak,
      longestStreak: streak?.longestStreak ?? user.longestStreak,
      totalActiveDays: streak?.totalActiveDays ?? 0,
      streakShields: streak?.streakShields ?? user.streakFreezeCount,
      totalLessonsCompleted: user.totalLessonsCompleted,
      vocabularyLearned: user.vocabularyLearned,
      achievements,
      recentAchievements,
    };
  }

  // -----------------------------------------------------------------------
  // Streak info (lightweight)
  // -----------------------------------------------------------------------

  async getStreakInfo(userId: string): Promise<Streak> {
    const streak = await this.streakRepository.findOne({ where: { userId } });

    if (!streak) {
      // Return a default empty streak without persisting it
      const empty = new Streak();
      empty.userId = userId;
      empty.currentStreak = 0;
      empty.longestStreak = 0;
      empty.totalActiveDays = 0;
      empty.streakShields = 0;
      return empty;
    }

    return streak;
  }

  // -----------------------------------------------------------------------
  // Streak shields
  // -----------------------------------------------------------------------

  /**
   * Consumes one streak shield for the user (manual claim by user).
   */
  async claimStreakShield(userId: string): Promise<{ success: boolean; remainingShields: number }> {
    const streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      throw new NotFoundException('Streak record not found. Complete a lesson first.');
    }

    if (streak.streakShields <= 0) {
      throw new BadRequestException('No streak shields available');
    }

    if (streak.isActiveToday) {
      throw new BadRequestException('You are already active today — no shield needed');
    }

    streak.streakShields -= 1;
    streak.shieldUsedToday = true;
    streak.shieldUsedDate = new Date().toISOString().split('T')[0];

    await this.streakRepository.save(streak);

    return { success: true, remainingShields: streak.streakShields };
  }

  // -----------------------------------------------------------------------
  // Achievements list
  // -----------------------------------------------------------------------

  async listAchievements(userId?: string): Promise<{
    achievements: Achievement[];
    earnedIds: string[];
  }> {
    const allAchievements = await this.achievementRepository.find({
      where: { isHidden: false },
      order: { rarity: 'ASC', conditionValue: 'ASC' },
    });

    let earnedIds: string[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['settings'],
      });
      earnedIds = Array.isArray(user?.settings?.earnedAchievements)
        ? user.settings.earnedAchievements
        : [];
    }

    return { achievements: allAchievements, earnedIds };
  }

  // -----------------------------------------------------------------------
  // Utilities
  // -----------------------------------------------------------------------

  private calculateLevel(xp: number): number {
    let level = 1;
    while (this.xpRequiredForLevel(level + 1) <= xp) {
      level++;
    }
    return level;
  }

  private xpRequiredForLevel(level: number): number {
    return Math.floor(this.XP_BASE * Math.pow(level, this.XP_PER_LEVEL_EXPONENT));
  }

  private getDateString(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  private daysBetween(dateA: string, dateB: string): number {
    const a = new Date(dateA).getTime();
    const b = new Date(dateB).getTime();
    return Math.round(Math.abs(b - a) / (1000 * 60 * 60 * 24));
  }
}
