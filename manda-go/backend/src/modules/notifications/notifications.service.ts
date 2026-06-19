import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { User } from '../users/entities/user.entity';

// ---------------------------------------------------------------------------
// FCM payload types (avoids importing firebase-admin in contexts without it)
// ---------------------------------------------------------------------------

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Firebase Admin App — lazily initialized to avoid crashes when creds missing
  private firebaseApp: any = null;
  private fcmInitialized = false;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.initFirebase();
  }

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------

  private initFirebase(): void {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    if (!projectId) {
      this.logger.warn(
        'FIREBASE_PROJECT_ID not set — push notifications are disabled.',
      );
      return;
    }

    try {
      // Dynamic import avoids hard-crash when firebase-admin is not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const admin = require('firebase-admin');

      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId,
        });
      } else {
        this.firebaseApp = admin.apps[0];
      }

      this.fcmInitialized = true;
      this.logger.log('Firebase Admin initialized successfully');
    } catch (err: any) {
      this.logger.warn(`Firebase Admin initialization failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // Core send
  // -------------------------------------------------------------------------

  /**
   * Sends a push notification to a single user via Firebase FCM.
   * Silently skips if the user has no push token or has notifications disabled.
   */
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<NotificationResult> {
    if (!this.fcmInitialized) {
      this.logger.debug('FCM not initialized — skipping push notification');
      return { success: false, error: 'FCM not initialized' };
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'pushToken', 'pushNotificationsEnabled'],
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.pushNotificationsEnabled) {
      this.logger.debug(`Push notifications disabled for user ${userId}`);
      return { success: false, error: 'Notifications disabled' };
    }

    if (!user.pushToken) {
      this.logger.debug(`No push token for user ${userId}`);
      return { success: false, error: 'No push token' };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const admin = require('firebase-admin');

      const message: any = {
        token: user.pushToken,
        notification: { title, body },
        data: {
          ...data,
          // Ensure all values are strings (FCM requirement)
          timestamp: String(Date.now()),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'mandago_default',
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const messageId = await admin.messaging(this.firebaseApp).send(message);

      this.logger.debug(
        `Push sent to user ${userId}: "${title}" — messageId: ${messageId}`,
      );

      return { success: true, messageId };
    } catch (err: any) {
      this.logger.error(
        `Failed to send push to user ${userId}: ${err.message}`,
      );

      // If the token is invalid, clear it from DB to avoid future failures
      if (
        err.code === 'messaging/registration-token-not-registered' ||
        err.code === 'messaging/invalid-registration-token'
      ) {
        await this.userRepository.update(userId, { pushToken: null });
        this.logger.warn(`Cleared invalid push token for user ${userId}`);
      }

      return { success: false, error: err.message };
    }
  }

  // -------------------------------------------------------------------------
  // Convenience senders
  // -------------------------------------------------------------------------

  /**
   * Sends a streak reminder nudge to the user.
   */
  async sendStreakReminder(
    userId: string,
    streakDays: number,
  ): Promise<NotificationResult> {
    const title = streakDays > 0
      ? `🔥 Don't break your ${streakDays}-day streak!`
      : '🌟 Start your streak today!';

    const body = streakDays > 0
      ? `You're on a roll! Complete a lesson today to keep your streak alive.`
      : `Practice just 5 minutes to begin your learning journey.`;

    return this.sendPushNotification(userId, title, body, {
      type: 'streak_reminder',
      streakDays: String(streakDays),
      screen: 'home',
    });
  }

  /**
   * Sends a congratulations notification when a user earns an achievement.
   */
  async sendAchievementNotification(
    userId: string,
    achievementName: string,
    achievementNameZh?: string,
    xpReward?: number,
  ): Promise<NotificationResult> {
    const title = `🏆 Achievement Unlocked!`;
    const body = xpReward
      ? `You earned "${achievementName}" (+${xpReward} XP)`
      : `You earned "${achievementName}"`;

    return this.sendPushNotification(userId, title, body, {
      type: 'achievement_earned',
      achievementName,
      achievementNameZh: achievementNameZh ?? '',
      xpReward: String(xpReward ?? 0),
      screen: 'achievements',
    });
  }

  /**
   * Sends a league rank update notification.
   */
  async sendLeagueUpdate(
    userId: string,
    rank: number,
    totalPlayers?: number,
  ): Promise<NotificationResult> {
    const title = rank <= 3
      ? `🥇 You're in the top ${rank}!`
      : `📊 League Update`;

    const body = totalPlayers
      ? `You're ranked #${rank} out of ${totalPlayers} players this week.`
      : `You're currently ranked #${rank} in your league.`;

    return this.sendPushNotification(userId, title, body, {
      type: 'league_update',
      rank: String(rank),
      screen: 'leaderboard',
    });
  }

  /**
   * Notifies users about a subscription payment failure.
   */
  async sendPaymentFailedNotification(userId: string): Promise<NotificationResult> {
    return this.sendPushNotification(
      userId,
      '⚠️ Payment Failed',
      'We couldn\'t process your subscription payment. Please update your payment method.',
      {
        type: 'payment_failed',
        screen: 'subscription',
      },
    );
  }

  // -------------------------------------------------------------------------
  // Batch / Scheduled operations
  // -------------------------------------------------------------------------

  /**
   * Cron job: fires every day at 19:00 (server timezone).
   * Sends streak reminder to all active users who haven't practiced today.
   */
  @Cron('0 19 * * *', { name: 'streak-reminders' })
  async scheduleStreakReminders(): Promise<void> {
    this.logger.log('Running scheduled streak reminders…');

    const today = new Date().toISOString().split('T')[0];

    // Fetch active users with notifications enabled and a push token
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.pushToken',
        'user.pushNotificationsEnabled',
        'user.lastActivityDate',
        'user.currentStreak',
      ])
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere('user.pushNotificationsEnabled = :enabled', { enabled: true })
      .andWhere('user.pushToken IS NOT NULL')
      .getMany();

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      const lastActivity = user.lastActivityDate
        ? new Date(user.lastActivityDate).toISOString().split('T')[0]
        : null;

      // Only remind users who haven't been active today
      if (lastActivity === today) {
        skipped++;
        continue;
      }

      const result = await this.sendStreakReminder(user.id, user.currentStreak);
      if (result.success) sent++;
    }

    this.logger.log(
      `Streak reminders done — sent: ${sent}, skipped (already active): ${skipped}`,
    );
  }

  // -------------------------------------------------------------------------
  // Event listeners (listens to domain events from other modules)
  // -------------------------------------------------------------------------

  @OnEvent('user.achievement.earned')
  async onAchievementEarned(payload: {
    userId: string;
    achievement: { name: string; nameZh: string; xpReward: number };
  }): Promise<void> {
    await this.sendAchievementNotification(
      payload.userId,
      payload.achievement.name,
      payload.achievement.nameZh,
      payload.achievement.xpReward,
    );
  }

  @OnEvent('subscription.payment.failed')
  async onPaymentFailed(payload: { userId: string }): Promise<void> {
    if (!payload.userId) return;
    await this.sendPaymentFailedNotification(payload.userId);
  }

  // -------------------------------------------------------------------------
  // Push token management
  // -------------------------------------------------------------------------

  /**
   * Registers or updates a device push token for the user.
   */
  async registerPushToken(userId: string, token: string): Promise<void> {
    await this.userRepository.update(userId, { pushToken: token });
    this.logger.debug(`Push token registered for user ${userId}`);
  }

  /**
   * Removes the push token for the user (on logout or unsubscribe).
   */
  async removePushToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, { pushToken: null });
    this.logger.debug(`Push token removed for user ${userId}`);
  }
}
