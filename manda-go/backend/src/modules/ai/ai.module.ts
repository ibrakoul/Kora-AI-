import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    BullModule.registerQueue({ name: 'ai-processing' }),
    BullModule.registerQueue({ name: 'pronunciation-analysis' }),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
