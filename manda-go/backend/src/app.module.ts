import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-ioredis-yet';
import * as Joi from 'joi';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LearningModule } from './modules/learning/learning.module';
import { AiModule } from './modules/ai/ai.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './health/health.module';

import { User } from './modules/users/entities/user.entity';
import { Lesson } from './modules/learning/entities/lesson.entity';
import { Exercise } from './modules/learning/entities/exercise.entity';
import { UserProgress } from './modules/learning/entities/user-progress.entity';
import { Achievement } from './modules/gamification/entities/achievement.entity';
import { Streak } from './modules/gamification/entities/streak.entity';

@Module({
  imports: [
    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
        PORT: Joi.number().default(3000),
        API_PREFIX: Joi.string().default('api'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().optional(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        OPENAI_API_KEY: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        AWS_REGION: Joi.string().default('us-east-1'),
        AWS_ACCESS_KEY_ID: Joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
        S3_BUCKET_NAME: Joi.string().optional(),
        FIREBASE_PROJECT_ID: Joi.string().optional(),
        ALLOWED_ORIGINS: Joi.string().default('http://localhost:3001'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Database (TypeORM with PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Lesson, Exercise, UserProgress, Achievement, Streak],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
        ssl: configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: false,
        extra: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000,
        },
        poolErrorHandler: (err: Error) => {
          console.error('Database pool error:', err);
        },
      }),
      inject: [ConfigService],
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 300, // 5 minutes default TTL
        max: 1000, // max items in cache
        keyPrefix: 'mandago:cache:',
      }),
      inject: [ConfigService],
    }),

    // Bull Queue (Redis-based job queue)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // Rate limiting (Throttler)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([
        {
          name: 'short',
          ttl: 1000,
          limit: 10,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 50,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 200,
        },
      ]),
      inject: [ConfigService],
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Event emitter for domain events
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // Health checks
    TerminusModule,

    // Feature modules
    AuthModule,
    UsersModule,
    LearningModule,
    AiModule,
    GamificationModule,
    SubscriptionsModule,
    NotificationsModule,
    HealthModule,
  ],
  providers: [
    // Global throttle guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
