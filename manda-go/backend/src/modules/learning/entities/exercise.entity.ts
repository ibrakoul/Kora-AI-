import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lesson } from './lesson.entity';

export enum ExerciseType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_BLANK = 'fill_blank',
  MATCHING = 'matching',
  ORDERING = 'ordering',
  TRANSLATION = 'translation',
  PRONUNCIATION = 'pronunciation',
  LISTENING = 'listening',
  CHARACTER_WRITE = 'character_write',
  TONE_SELECT = 'tone_select',
  SENTENCE_BUILD = 'sentence_build',
  DIALOGUE = 'dialogue',
  TRUE_FALSE = 'true_false',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  ELEMENTARY = 'elementary',
  INTERMEDIATE = 'intermediate',
  UPPER_INTERMEDIATE = 'upper_intermediate',
  ADVANCED = 'advanced',
}

@Entity('exercises')
@Index(['lessonId', 'orderIndex'])
@Index(['type'])
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lessonId: string;

  @Column({
    type: 'enum',
    enum: ExerciseType,
    default: ExerciseType.MULTIPLE_CHOICE,
  })
  type: ExerciseType;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  // Question content (supports Chinese characters, pinyin, and English)
  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promptPinyin: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  promptTranslation: string;

  // Audio for listening exercises
  @Column({ type: 'varchar', length: 500, nullable: true })
  audioUrl: string;

  // Image for visual exercises
  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  // Answer configuration
  @Column({ type: 'text' })
  correctAnswer: string;

  // For multiple choice: array of options
  @Column({ type: 'jsonb', nullable: true })
  options: Array<{
    id: string;
    text: string;
    pinyin?: string;
    translation?: string;
    audioUrl?: string;
  }>;

  // For matching exercises: pairs
  @Column({ type: 'jsonb', nullable: true })
  pairs: Array<{
    left: string;
    right: string;
    leftPinyin?: string;
  }>;

  // For ordering: items to arrange
  @Column({ type: 'jsonb', nullable: true })
  items: Array<{
    id: string;
    text: string;
    pinyin?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'text', nullable: true })
  hint: string;

  // Grammar/vocabulary reference
  @Column({ type: 'varchar', length: 200, nullable: true })
  relatedVocabularyId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  grammarPoint: string;

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.BEGINNER,
  })
  difficulty: Difficulty;

  @Column({ type: 'int', default: 10 })
  xpReward: number;

  // Time limit in seconds (0 = no limit)
  @Column({ type: 'int', default: 0 })
  timeLimitSeconds: number;

  // Pronunciation specific fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  targetPinyin: string;

  @Column({ type: 'int', nullable: true })
  targetTone: number; // 1, 2, 3, 4, or 0 (neutral)

  // Statistical data for adaptive learning
  @Column({ type: 'int', default: 0 })
  totalAttempts: number;

  @Column({ type: 'int', default: 0 })
  correctAttempts: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  successRate: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
