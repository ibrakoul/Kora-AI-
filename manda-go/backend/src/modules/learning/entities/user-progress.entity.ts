import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Lesson } from './lesson.entity';

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

@Entity('user_progress')
@Unique(['userId', 'lessonId'])
@Index(['userId', 'status'])
@Index(['userId', 'completedAt'])
@Index(['lessonId'])
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  lessonId: string;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  lastScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  bestScore: number;

  @Column({ type: 'int', default: 0 })
  attemptsCount: number;

  @Column({ type: 'int', default: 0 })
  timeSpentSeconds: number;

  @Column({ type: 'int', default: 0 })
  xpEarned: number;

  // Track individual exercise performance
  @Column({ type: 'jsonb', default: [] })
  exerciseResults: Array<{
    exerciseId: string;
    correct: boolean;
    timeTaken: number;
    attempt: number;
  }>;

  // Spaced repetition data for vocabulary in this lesson
  @Column({ type: 'jsonb', default: {} })
  srsData: Record<
    string,
    {
      interval: number;
      easeFactor: number;
      nextReviewDate: string;
      repetitions: number;
    }
  >;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastAttemptAt: Date;

  // Streaks: whether this was completed as part of daily goal
  @Column({ type: 'boolean', default: false })
  countedForStreak: boolean;

  @Column({ type: 'date', nullable: true })
  streakDate: Date;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
