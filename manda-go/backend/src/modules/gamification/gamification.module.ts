import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { Achievement } from './entities/achievement.entity';
import { Streak } from './entities/streak.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, Streak, User]),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService, TypeOrmModule],
})
export class GamificationModule {}
