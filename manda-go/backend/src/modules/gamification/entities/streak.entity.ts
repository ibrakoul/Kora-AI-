import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('streaks')
@Index(['userId'], { unique: true })
@Index(['lastActivityDate'])
export class Streak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  /**
   * Number of consecutive days the user has been active
   */
  @Column('int', { default: 0 })
  currentStreak: number;

  /**
   * All-time longest streak for the user
   */
  @Column('int', { default: 0 })
  longestStreak: number;

  /**
   * ISO date string (YYYY-MM-DD) of the last day the user completed an activity
   */
  @Column({ type: 'date', nullable: true })
  lastActivityDate: string;

  /**
   * Streak shields protect the streak when the user misses a day.
   * Alias: "streak freezes"
   */
  @Column('int', { default: 0 })
  streakShields: number;

  /**
   * Cumulative number of calendar days on which the user was active (all time)
   */
  @Column('int', { default: 0 })
  totalActiveDays: number;

  /**
   * Tracks whether a shield was consumed today to avoid double-consuming
   */
  @Column({ type: 'boolean', default: false })
  shieldUsedToday: boolean;

  /**
   * Date on which the last shield was consumed
   */
  @Column({ type: 'date', nullable: true })
  shieldUsedDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Derived helpers ---

  /**
   * Returns true when the user has already logged activity today
   */
  get isActiveToday(): boolean {
    if (!this.lastActivityDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return this.lastActivityDate === today;
  }

  /**
   * Returns true when the streak is at risk (last activity was yesterday and no shield used)
   */
  get isAtRisk(): boolean {
    if (!this.lastActivityDate || this.isActiveToday) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return this.lastActivityDate === yesterdayStr;
  }
}
