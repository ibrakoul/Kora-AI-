import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class CreateCheckoutDto {
  priceId: string;
}

@Controller('api/v1/subscriptions')
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * GET /api/v1/subscriptions/plans
   * Public — returns the available subscription plans.
   */
  @Get('plans')
  getPlans() {
    const plans = this.subscriptionsService.getPlans();
    return {
      success: true,
      data: { plans },
    };
  }

  /**
   * POST /api/v1/subscriptions/checkout
   * Creates a Stripe Checkout session. Requires authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async createCheckoutSession(
    @Request() req: any,
    @Body() body: CreateCheckoutDto,
  ) {
    if (!body?.priceId) {
      throw new BadRequestException('priceId is required');
    }

    const userId: string = req.user.id;
    this.logger.log(`Checkout session requested by user ${userId} for price ${body.priceId}`);

    const result = await this.subscriptionsService.createCheckoutSession(
      userId,
      body.priceId,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * POST /api/v1/subscriptions/cancel
   * Cancels (at period end) the user's active subscription.
   */
  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Request() req: any) {
    const userId: string = req.user.id;
    this.logger.log(`Subscription cancellation requested by user ${userId}`);

    const result = await this.subscriptionsService.cancelSubscription(userId);

    return {
      success: result.success,
      data: {
        cancelAt: result.cancelAt,
        message: result.cancelAt
          ? `Subscription will end on ${result.cancelAt.toISOString()}`
          : 'Subscription cancelled',
      },
    };
  }

  /**
   * GET /api/v1/subscriptions/status
   * Returns the current user's subscription status.
   */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getSubscriptionStatus(@Request() req: any) {
    const userId: string = req.user.id;
    const status = await this.subscriptionsService.getSubscription(userId);

    return {
      success: true,
      data: status,
    };
  }

  /**
   * POST /api/v1/subscriptions/webhook
   * Stripe webhook endpoint — no JWT auth, uses raw body + Stripe signature.
   * Must be registered with raw body parser in main.ts.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    if (!signature) {
      this.logger.warn('Webhook received without Stripe-Signature header');
      throw new BadRequestException('Missing Stripe-Signature header');
    }

    // req.rawBody is set by the raw body middleware registered in main.ts
    const rawBody: Buffer = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body not available');
    }

    return this.subscriptionsService.handleWebhook(rawBody, signature);
  }
}
