import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';

import { User, SubscriptionTier } from '../users/entities/user.entity';

// ---------------------------------------------------------------------------
// Plan catalogue
// ---------------------------------------------------------------------------

export interface PlanDefinition {
  id: string;
  name: string;
  priceId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
}

export const PLANS: Record<string, PlanDefinition> = {
  PLUS_MONTHLY: {
    id: 'plus_monthly',
    name: 'Manda Go Plus — Monthly',
    priceId: process.env.STRIPE_PRICE_PLUS_MONTHLY ?? 'price_plus_monthly',
    price: 4.99,
    currency: 'eur',
    interval: 'month',
    features: [
      'Unlimited lessons',
      'AI conversation partner',
      'Offline mode',
      'No ads',
      'Advanced analytics',
    ],
  },
  PLUS_YEARLY: {
    id: 'plus_yearly',
    name: 'Manda Go Plus — Yearly',
    priceId: process.env.STRIPE_PRICE_PLUS_YEARLY ?? 'price_plus_yearly',
    price: 39.99,
    currency: 'eur',
    interval: 'year',
    features: [
      'All monthly features',
      'Save 33% vs monthly',
      'Priority support',
      '2 streak shields per month',
    ],
  },
  LIFETIME: {
    id: 'lifetime',
    name: 'Manda Go Plus — Lifetime',
    priceId: process.env.STRIPE_PRICE_LIFETIME ?? 'price_lifetime',
    price: 149.99,
    currency: 'eur',
    interval: 'lifetime',
    features: [
      'All yearly features',
      'One-time payment',
      'Future feature access',
      'Lifetime streak shields',
    ],
  },
};

// ---------------------------------------------------------------------------
// Subscription status DTO
// ---------------------------------------------------------------------------

export interface SubscriptionStatus {
  isActive: boolean;
  tier: SubscriptionTier;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  plan: string | null;
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-04-10',
      typescript: true,
    });
  }

  // -------------------------------------------------------------------------
  // Plans
  // -------------------------------------------------------------------------

  getPlans(): PlanDefinition[] {
    return Object.values(PLANS);
  }

  // -------------------------------------------------------------------------
  // Checkout
  // -------------------------------------------------------------------------

  /**
   * Creates a Stripe Checkout session for the given plan.
   * Handles both recurring and one-time (lifetime) plans.
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
  ): Promise<{ url: string; sessionId: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Resolve or create Stripe customer
    const customerId = await this.getOrCreateCustomer(user);

    // Determine whether this is a one-time or subscription price
    const price = await this.stripe.prices.retrieve(priceId);
    const isOneTime = price.type === 'one_time';

    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3001');

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: isOneTime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscription/cancel`,
      metadata: {
        userId,
        priceId,
      },
      allow_promotion_codes: true,
    };

    if (!isOneTime) {
      sessionParams.subscription_data = {
        metadata: { userId },
      };
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    this.logger.log(`Checkout session created for user ${userId}: ${session.id}`);

    return { url: session.url!, sessionId: session.id };
  }

  // -------------------------------------------------------------------------
  // Cancel
  // -------------------------------------------------------------------------

  /**
   * Schedules cancellation at the end of the current billing period.
   */
  async cancelSubscription(userId: string): Promise<{ success: boolean; cancelAt: Date | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stripeCustomerId = user.settings?.stripeCustomerId as string | undefined;
    if (!stripeCustomerId) {
      throw new BadRequestException('No active subscription found');
    }

    // Find active subscriptions for this customer
    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (!subscriptions.data.length) {
      throw new BadRequestException('No active subscription found');
    }

    const subscription = subscriptions.data[0];

    // Cancel at period end instead of immediately
    const updated = await this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    const cancelAt = updated.cancel_at
      ? new Date(updated.cancel_at * 1000)
      : null;

    this.logger.log(`Subscription cancellation scheduled for user ${userId}, cancel_at: ${cancelAt}`);

    this.eventEmitter.emit('subscription.cancel.scheduled', {
      userId,
      subscriptionId: subscription.id,
      cancelAt,
    });

    return { success: true, cancelAt };
  }

  // -------------------------------------------------------------------------
  // Status
  // -------------------------------------------------------------------------

  async getSubscription(userId: string): Promise<SubscriptionStatus> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stripeCustomerId = user.settings?.stripeCustomerId as string | undefined;

    if (!stripeCustomerId) {
      return this.buildFreeStatus();
    }

    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
      expand: ['data.default_payment_method'],
    });

    if (!subscriptions.data.length) {
      // Check for a lifetime purchase
      if (user.subscriptionTier === SubscriptionTier.PREMIUM) {
        return {
          isActive: true,
          tier: SubscriptionTier.PREMIUM,
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          plan: 'lifetime',
        };
      }
      return this.buildFreeStatus();
    }

    const sub = subscriptions.data[0];
    const planNickname = sub.items.data[0]?.price.nickname ?? sub.items.data[0]?.price.id ?? null;

    return {
      isActive: true,
      tier: SubscriptionTier.PREMIUM,
      stripeSubscriptionId: sub.id,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      plan: planNickname,
    };
  }

  // -------------------------------------------------------------------------
  // Webhook
  // -------------------------------------------------------------------------

  /**
   * Validates and processes incoming Stripe webhook events.
   */
  async handleWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      this.logger.warn(`Stripe webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    this.logger.log(`Processing Stripe event: ${event.type} (${event.id})`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionCreatedOrUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        this.logger.log(`Payment succeeded for invoice ${(event.data.object as Stripe.Invoice).id}`);
        break;

      default:
        this.logger.debug(`Unhandled Stripe event type: ${event.type}`);
    }

    return { received: true };
  }

  // -------------------------------------------------------------------------
  // Private webhook handlers
  // -------------------------------------------------------------------------

  private async handleSubscriptionCreatedOrUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      this.logger.warn(`No userId in subscription metadata: ${subscription.id}`);
      return;
    }

    const isActive = ['active', 'trialing'].includes(subscription.status);

    await this.userRepository.update(userId, {
      subscriptionTier: isActive ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE,
      settings: () => `settings || '{"stripeSubscriptionId": "${subscription.id}"}'`,
    });

    this.logger.log(
      `Subscription ${subscription.id} → ${subscription.status} for user ${userId}`,
    );

    this.eventEmitter.emit('subscription.updated', {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
      isActive,
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    await this.userRepository.update(userId, {
      subscriptionTier: SubscriptionTier.FREE,
    });

    this.logger.log(`Subscription deleted for user ${userId}`);

    this.eventEmitter.emit('subscription.deleted', { userId, subscriptionId: subscription.id });
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) return;

    // Store Stripe customer ID for future lookups
    if (session.customer) {
      const customerId = typeof session.customer === 'string'
        ? session.customer
        : session.customer.id;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        await this.userRepository.update(userId, {
          settings: { ...user.settings, stripeCustomerId: customerId },
        });
      }
    }

    // One-time payment (lifetime) activation
    if (session.mode === 'payment') {
      await this.userRepository.update(userId, {
        subscriptionTier: SubscriptionTier.PREMIUM,
      });
      this.logger.log(`Lifetime purchase activated for user ${userId}`);
      this.eventEmitter.emit('subscription.lifetime.activated', { userId });
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const customerId = typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id;

    if (!customerId) return;

    const user = await this.userRepository.findOne({
      where: { settings: { stripeCustomerId: customerId } } as any,
    });

    const userId = user?.id ?? invoice.subscription_details?.metadata?.userId;

    this.logger.warn(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);

    this.eventEmitter.emit('subscription.payment.failed', {
      userId: userId ?? customerId,
      invoiceId: invoice.id,
      amountDue: invoice.amount_due,
      nextAttempt: invoice.next_payment_attempt,
    });
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private async getOrCreateCustomer(user: User): Promise<string> {
    const existingId = user.settings?.stripeCustomerId as string | undefined;
    if (existingId) return existingId;

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      metadata: { userId: user.id },
    });

    await this.userRepository.update(user.id, {
      settings: { ...user.settings, stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  private buildFreeStatus(): SubscriptionStatus {
    return {
      isActive: false,
      tier: SubscriptionTier.FREE,
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      plan: null,
    };
  }
}
