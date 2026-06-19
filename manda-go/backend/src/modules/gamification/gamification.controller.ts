import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/gamification')
export class GamificationController {
  private readonly logger = new Logger(GamificationController.name);

  constructor(private readonly gamificationService: GamificationService) {}

  /**
   * GET /api/v1/gamification/stats
   * Returns complete gamification stats for the authenticated user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getUserStats(@Request() req: any) {
    const userId: string = req.user.id;
    this.logger.debug(`Fetching gamification stats for user ${userId}`);

    const stats = await this.gamificationService.getUserStats(userId);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * GET /api/v1/gamification/leaderboard
   * Returns the top-30 leaderboard. Optionally filtered by league/season.
   */
  @Get('leaderboard')
  async getLeaderboard(
    @Query('leagueId') leagueId?: string,
    @Query('seasonId') seasonId?: string,
  ) {
    const leaderboard = await this.gamificationService.getLeaderboard(
      leagueId,
      seasonId,
    );

    return {
      success: true,
      data: {
        leaderboard,
        total: leaderboard.length,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * GET /api/v1/gamification/streak
   * Returns the current user's streak details.
   */
  @UseGuards(JwtAuthGuard)
  @Get('streak')
  async getStreak(@Request() req: any) {
    const userId: string = req.user.id;
    const streak = await this.gamificationService.getStreakInfo(userId);

    return {
      success: true,
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        streakShields: streak.streakShields,
        totalActiveDays: streak.totalActiveDays,
        isActiveToday: streak.isActiveToday,
        isAtRisk: streak.isAtRisk,
      },
    };
  }

  /**
   * POST /api/v1/gamification/claim-shield
   * Manually applies a streak shield to protect the current streak.
   */
  @UseGuards(JwtAuthGuard)
  @Post('claim-shield')
  @HttpCode(HttpStatus.OK)
  async claimStreakShield(@Request() req: any) {
    const userId: string = req.user.id;
    this.logger.log(`User ${userId} claiming streak shield`);

    const result = await this.gamificationService.claimStreakShield(userId);

    return {
      success: result.success,
      data: {
        remainingShields: result.remainingShields,
        message: `Shield applied. You have ${result.remainingShields} shield(s) remaining.`,
      },
    };
  }

  /**
   * GET /api/v1/gamification/achievements
   * Returns all public achievements, marking which ones the user has earned.
   */
  @UseGuards(JwtAuthGuard)
  @Get('achievements')
  async listAchievements(@Request() req: any) {
    const userId: string = req.user.id;

    const { achievements, earnedIds } =
      await this.gamificationService.listAchievements(userId);

    // Annotate each achievement with earned status
    const annotated = achievements.map((a) => ({
      ...a,
      isEarned: earnedIds.includes(a.id),
    }));

    return {
      success: true,
      data: {
        achievements: annotated,
        total: annotated.length,
        earned: earnedIds.length,
      },
    };
  }
}
