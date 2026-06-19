import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AchievementType {
  STREAK = 'streak',
  XP = 'xp',
  LESSONS = 'lessons',
  VOCABULARY = 'vocabulary',
  SPECIAL = 'special',
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum ConditionType {
  STREAK_DAYS = 'streak_days',
  TOTAL_XP = 'total_xp',
  LESSONS_COMPLETED = 'lessons_completed',
  VOCABULARY_LEARNED = 'vocabulary_learned',
  PERFECT_SCORE = 'perfect_score',
  DAYS_ACTIVE = 'days_active',
  REFERRALS = 'referrals',
  CONSECUTIVE_PERFECT = 'consecutive_perfect',
}

@Entity('achievements')
@Index(['type'])
@Index(['rarity'])
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  nameZh: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  iconUrl: string;

  /**
   * Achievement category: streak, xp, lessons, vocabulary, special
   */
  @Column({ type: 'varchar', length: 50 })
  type: string;

  /**
   * What condition triggers this achievement (e.g. streak_days, total_xp)
   */
  @Column({ type: 'varchar', length: 100 })
  conditionType: string;

  /**
   * Numeric threshold to unlock (e.g. 7 for a 7-day streak)
   */
  @Column('int')
  conditionValue: number;

  @Column('int', { default: 0 })
  xpReward: number;

  /**
   * Hidden achievements are not shown in the list until earned
   */
  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  /**
   * Rarity tier: common, rare, epic, legendary
   */
  @Column({ type: 'varchar', length: 50, default: 'common' })
  rarity: string;

  @CreateDateColumn()
  createdAt: Date;

  // --- Virtual helpers ---

  get displayNameLocalized(): Record<string, string> {
    return {
      en: this.name,
      zh: this.nameZh,
    };
  }

  get rarityColor(): string {
    const colors: Record<string, string> = {
      common: '#9E9E9E',
      rare: '#2196F3',
      epic: '#9C27B0',
      legendary: '#FF9800',
    };
    return colors[this.rarity] ?? colors['common'];
  }
}
