import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  PLATINUM = 'platinum',
}

export enum HskLevel {
  HSK1 = 'HSK1',
  HSK2 = 'HSK2',
  HSK3 = 'HSK3',
  HSK4 = 'HSK4',
  HSK5 = 'HSK5',
  HSK6 = 'HSK6',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
@Index(['googleId'], { sparse: true })
@Index(['appleId'], { sparse: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Authentication
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  googleId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  appleId: string;

  @Column({ type: 'text', nullable: true })
  refreshTokenHash: string;

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  // Profile
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  nativeLanguage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone: string;

  @Column({ type: 'varchar', length: 10, default: 'zh-CN' })
  targetLanguage: string;

  // Authorization
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  subscriptionTier: SubscriptionTier;

  // Email verification
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpiry: Date;

  // Password reset
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpiry: Date;

  // Account status
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockoutUntil: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  banReason: string;

  @Column({ type: 'uuid', nullable: true })
  bannedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  bannedAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  deletionReason: string;

  // Login tracking
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  lastLoginIp: string;

  // Learning progress
  @Column({ type: 'int', default: 0 })
  totalXp: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  totalLessonsCompleted: number;

  @Column({ type: 'int', default: 0 })
  totalPracticeMinutes: number;

  @Column({ type: 'int', default: 0 })
  vocabularyLearned: number;

  @Column({
    type: 'enum',
    enum: HskLevel,
    default: HskLevel.HSK1,
    nullable: true,
  })
  currentHskLevel: HskLevel;

  // Streak
  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Column({ type: 'date', nullable: true })
  lastActivityDate: Date;

  @Column({ type: 'int', default: 0 })
  streakFreezeCount: number;

  // Hearts system (lives)
  @Column({ type: 'int', default: 5 })
  heartsCount: number;

  @Column({ type: 'timestamp', nullable: true })
  heartsRefillAt: Date;

  // Referral
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  referralCode: string;

  @Column({ type: 'uuid', nullable: true })
  referredBy: string;

  // Push notifications
  @Column({ type: 'varchar', length: 512, nullable: true })
  pushToken: string;

  @Column({ type: 'boolean', default: true })
  pushNotificationsEnabled: boolean;

  // Settings (JSON)
  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Virtual fields
  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  @BeforeInsert()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
    if (!this.referralCode) {
      this.referralCode = this.generateReferralCode();
    }
  }

  @BeforeUpdate()
  normalizeEmailOnUpdate() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
