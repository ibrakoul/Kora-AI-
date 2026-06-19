import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';

import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { UserProgress } from './entities/user-progress.entity';
import { UsersModule } from '../users/users.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Exercise, UserProgress]),
    BullModule.registerQueue({ name: 'learning-events' }),
    BullModule.registerQueue({ name: 'ai-processing' }),
    UsersModule,
    GamificationModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
  exports: [LearningService, TypeOrmModule],
})
export class LearningModule {}
