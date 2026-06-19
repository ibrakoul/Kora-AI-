import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username: username.toLowerCase() } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { emailVerificationToken: token } });
  }

  async findByResetToken(hashedToken: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { passwordResetToken: hashedToken } });
  }

  async getFullProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['streak', 'subscriptions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, refreshTokenHash, emailVerificationToken, passwordResetToken, ...profile } = user as any;

    return { profile };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check username uniqueness if being changed
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    const { password, refreshTokenHash, ...sanitized } = updatedUser as any;
    return { user: sanitized };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Process image with sharp
    const optimizedBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    // In production, upload to S3
    // const avatarUrl = await this.s3Service.uploadFile(optimizedBuffer, `avatars/${userId}.webp`);

    // For now, return a placeholder
    const avatarUrl = `https://cdn.mandago.app/avatars/${userId}.webp`;

    await this.userRepository.update(userId, { avatarUrl });

    return { avatarUrl };
  }

  async getLearningStats(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      totalXp: user.totalXp,
      currentLevel: user.level,
      totalLessonsCompleted: user.totalLessonsCompleted,
      totalPracticeMinutes: user.totalPracticeMinutes,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      vocabularyLearned: user.vocabularyLearned,
    };
  }

  async getStreakInfo(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastActivityDate: user.lastActivityDate,
      streakFreezeCount: user.streakFreezeCount,
    };
  }

  async getAchievements(userId: string) {
    // This will be enhanced by GamificationService
    return { achievements: [] };
  }

  async getLeaderboard(userId: string, type: string, period: string, limit: number) {
    // Simplified leaderboard - enhanced version would use materialized views
    const users = await this.userRepository.find({
      select: ['id', 'username', 'firstName', 'avatarUrl', 'totalXp', 'level'],
      order: { totalXp: 'DESC' },
      take: Math.min(limit, 100),
    });

    const currentUserIndex = users.findIndex((u) => u.id === userId);

    return {
      leaderboard: users.map((u, index) => ({
        rank: index + 1,
        userId: u.id,
        username: u.username,
        displayName: u.firstName,
        avatarUrl: u.avatarUrl,
        xp: u.totalXp,
        level: u.level,
        isCurrentUser: u.id === userId,
      })),
      currentUserRank: currentUserIndex >= 0 ? currentUserIndex + 1 : null,
    };
  }

  async getNotifications(userId: string, options: { unread?: boolean; page: number; limit: number }) {
    return { notifications: [], total: 0, page: options.page, limit: options.limit };
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    // Implementation with notifications table
  }

  async updateSettings(userId: string, settings: Record<string, any>) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedSettings = [
      'dailyGoalMinutes', 'reminderEnabled', 'reminderTime', 'soundEnabled',
      'hapticEnabled', 'language', 'theme', 'fontSizeScale',
    ];

    const filteredSettings: Record<string, any> = {};
    for (const key of allowedSettings) {
      if (settings[key] !== undefined) {
        filteredSettings[key] = settings[key];
      }
    }

    await this.userRepository.update(userId, { settings: { ...user.settings, ...filteredSettings } });

    return { message: 'Settings updated successfully', settings: filteredSettings };
  }

  async deleteAccount(userId: string, password: string, reason?: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Soft delete (anonymize instead of hard delete for data retention)
    await this.userRepository.update(userId, {
      isActive: false,
      email: `deleted_${userId}@deleted.mandago.app`,
      username: `deleted_${userId.slice(0, 8)}`,
      firstName: 'Deleted',
      lastName: 'User',
      deletedAt: new Date(),
      deletionReason: reason,
    });

    this.logger.log(`Account deleted: ${userId}, reason: ${reason}`);
  }

  async findAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<User> = {
      skip,
      take: Math.min(limit, 100),
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'isActive', 'createdAt', 'role'],
    };

    if (search) {
      findOptions.where = [
        { email: ILike(`%${search}%`) },
        { username: ILike(`%${search}%`) },
        { firstName: ILike(`%${search}%`) },
      ];
    }

    const [users, total] = await this.userRepository.findAndCount(findOptions);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async banUser(userId: string, reason: string, adminId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, {
      isActive: false,
      banReason: reason,
      bannedBy: adminId,
      bannedAt: new Date(),
    });

    return { message: 'User banned successfully' };
  }

  // Auth-related methods
  async updateRefreshToken(userId: string, refreshTokenHash: string): Promise<void> {
    await this.userRepository.update(userId, { refreshTokenHash });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshTokenHash: null });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });
  }

  async setPasswordResetToken(userId: string, hashedToken: string, expiry: Date): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: hashedToken,
      passwordResetExpiry: expiry,
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    });
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      failedLoginAttempts: 0,
      lockoutUntil: null,
    });
  }

  async incrementFailedLoginAttempts(userId: string, attempts: number): Promise<void> {
    await this.userRepository.update(userId, { failedLoginAttempts: attempts });
  }

  async lockAccount(userId: string, lockoutUntil: Date): Promise<void> {
    await this.userRepository.update(userId, {
      lockoutUntil,
      failedLoginAttempts: 0,
    });
  }

  async updateLastLogin(userId: string, ip: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<void> {
    await this.userRepository.update(userId, { googleId });
  }

  async linkAppleAccount(userId: string, appleId: string): Promise<void> {
    await this.userRepository.update(userId, { appleId });
  }

  async incrementTokenVersion(userId: string): Promise<void> {
    await this.userRepository.increment({ id: userId }, 'tokenVersion', 1);
  }

  async addXp(userId: string, xpAmount: number): Promise<{ leveled_up: boolean; newLevel?: number }> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newXp = user.totalXp + xpAmount;
    const newLevel = this.calculateLevel(newXp);
    const leveled_up = newLevel > user.level;

    await this.userRepository.update(userId, {
      totalXp: newXp,
      level: newLevel,
      lastActivityDate: new Date(),
    });

    return { leveled_up, newLevel: leveled_up ? newLevel : undefined };
  }

  private calculateLevel(xp: number): number {
    // XP required for level n: 100 * n^1.5
    let level = 1;
    while (this.xpRequiredForLevel(level + 1) <= xp) {
      level++;
    }
    return level;
  }

  private xpRequiredForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
