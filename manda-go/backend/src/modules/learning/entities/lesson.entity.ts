import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Exercise } from './exercise.entity';

export enum LessonType {
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  PRONUNCIATION = 'pronunciation',
  READING = 'reading',
  LISTENING = 'listening',
  CONVERSATION = 'conversation',
  REVIEW = 'review',
  CULTURE = 'culture',
}

export enum HskLevel {
  HSK1 = 'HSK1',
  HSK2 = 'HSK2',
  HSK3 = 'HSK3',
  HSK4 = 'HSK4',
  HSK5 = 'HSK5',
  HSK6 = 'HSK6',
}

@Entity('lessons')
@Index(['courseId', 'orderIndex'])
@Index(['hskLevel'])
@Index(['isPublished'])
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  contentHtml: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.VOCABULARY,
  })
  type: LessonType;

  @Column({
    type: 'enum',
    enum: HskLevel,
    nullable: true,
  })
  hskLevel: HskLevel;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  audioUrl: string;

  @Column({ type: 'int', default: 10 })
  estimatedMinutes: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'int', default: 50 })
  xpReward: number;

  @Column({ type: 'int', default: 0 })
  heartsCost: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  prerequisiteLessonId: string;

  // Learning objectives (what students will learn)
  @Column({ type: 'jsonb', default: [] })
  objectives: string[];

  // Vocabulary words introduced in this lesson
  @Column({ type: 'jsonb', default: [] })
  vocabularyIds: string[];

  // Grammar points covered
  @Column({ type: 'jsonb', default: [] })
  grammarPoints: string[];

  // Cultural notes
  @Column({ type: 'text', nullable: true })
  culturalNote: string;

  // Tags for search/filtering
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  completionCount: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  averageScore: number;

  @Column({ type: 'int', default: 0 })
  averageTimeSeconds: number;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @OneToMany(() => Exercise, (exercise) => exercise.lesson, { cascade: true })
  exercises: Exercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
