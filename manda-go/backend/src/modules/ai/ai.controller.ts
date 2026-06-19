import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Sse,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { PronunciationCheckDto } from './dto/pronunciation-check.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @Throttle({ medium: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary: 'Chat with AI Mandarin tutor',
    description: 'Send a message to the AI tutor. Supports context-aware conversations about Mandarin learning.',
  })
  @ApiResponse({ status: 200, description: 'AI response with explanation and follow-up suggestions' })
  @ApiResponse({ status: 429, description: 'Too many requests - AI usage limit reached' })
  async chat(
    @CurrentUser() user: { id: string; subscriptionTier: string },
    @Body() chatDto: ChatDto,
  ) {
    return this.aiService.chat(user.id, chatDto, user.subscriptionTier);
  }

  @Post('chat/stream')
  @Throttle({ medium: { limit: 20, ttl: 60000 } })
  @Sse()
  @ApiOperation({ summary: 'Stream AI tutor response using Server-Sent Events' })
  streamChat(
    @CurrentUser() user: { id: string; subscriptionTier: string },
    @Body() chatDto: ChatDto,
  ): Observable<MessageEvent> {
    return this.aiService.streamChat(user.id, chatDto, user.subscriptionTier);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversation history' })
  @ApiResponse({ status: 200, description: 'List of past AI conversations' })
  async getConversations(
    @CurrentUser() user: { id: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.aiService.getConversations(user.id, { page, limit });
  }

  @Get('conversations/:conversationId')
  @ApiOperation({ summary: 'Get a specific conversation with full message history' })
  async getConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.aiService.getConversation(conversationId, user.id);
  }

  @Post('conversations/:conversationId/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reset/clear a conversation context' })
  async resetConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @CurrentUser() user: { id: string },
  ) {
    await this.aiService.resetConversation(conversationId, user.id);
  }

  @Post('pronunciation/check')
  @Throttle({ medium: { limit: 50, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp3|mp4|wav|m4a|ogg|webm)$/)) {
          return cb(new BadRequestException('Invalid audio format'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Analyze pronunciation of a Chinese word or phrase',
    description: 'Upload an audio recording to get pronunciation feedback and tone accuracy score.',
  })
  @ApiResponse({ status: 200, description: 'Pronunciation analysis with score and feedback' })
  async checkPronunciation(
    @CurrentUser() user: { id: string },
    @UploadedFile() audioFile: Express.Multer.File,
    @Body() pronunciationCheckDto: PronunciationCheckDto,
  ) {
    if (!audioFile) {
      throw new BadRequestException('Audio file is required');
    }
    return this.aiService.checkPronunciation(user.id, audioFile, pronunciationCheckDto);
  }

  @Post('translate')
  @Throttle({ long: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Translate text between Chinese and English' })
  async translate(
    @CurrentUser() user: { id: string },
    @Body() body: { text: string; from?: string; to?: string; includeBreakdown?: boolean },
  ) {
    return this.aiService.translate(body.text, body.from || 'zh', body.to || 'en', body.includeBreakdown);
  }

  @Post('explain')
  @Throttle({ medium: { limit: 40, ttl: 60000 } })
  @ApiOperation({ summary: 'Get detailed explanation of a Chinese word, character, or grammar point' })
  async explain(
    @CurrentUser() user: { id: string },
    @Body() body: { text: string; type?: 'word' | 'character' | 'grammar' | 'phrase'; nativeLanguage?: string },
  ) {
    return this.aiService.explain(user.id, body.text, body.type || 'word', body.nativeLanguage || 'en');
  }

  @Post('generate-sentence')
  @Throttle({ medium: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate example sentences using a specific word or grammar pattern' })
  async generateSentence(
    @CurrentUser() user: { id: string },
    @Body() body: { word: string; hskLevel?: string; count?: number },
  ) {
    return this.aiService.generateSentences(
      body.word,
      body.hskLevel || 'HSK1',
      body.count || 3,
      user.id,
    );
  }

  @Post('grammar-check')
  @Throttle({ medium: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Check grammar of a Chinese sentence and provide corrections' })
  async grammarCheck(
    @CurrentUser() user: { id: string },
    @Body() body: { sentence: string },
  ) {
    return this.aiService.checkGrammar(body.sentence, user.id);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI usage statistics for current billing period' })
  async getUsage(@CurrentUser() user: { id: string }) {
    return this.aiService.getUsageStats(user.id);
  }
}
