import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('learning')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'learning', version: '1' })
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get all available courses (HSK levels)' })
  @ApiResponse({ status: 200, description: 'List of courses with user progress' })
  async getCourses(@CurrentUser() user: { id: string }) {
    return this.learningService.getCourses(user.id);
  }

  @Get('courses/:courseId')
  @ApiParam({ name: 'courseId', type: String })
  @ApiOperation({ summary: 'Get course details with lessons' })
  async getCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.learningService.getCourse(courseId, user.id);
  }

  @Get('courses/:courseId/lessons')
  @ApiParam({ name: 'courseId', type: String })
  @ApiOperation({ summary: 'Get lessons for a specific course' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async getCourseLessons(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: { id: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.learningService.getCourseLessons(courseId, user.id, { page, limit });
  }

  @Get('lessons/:lessonId')
  @ApiParam({ name: 'lessonId', type: String })
  @ApiOperation({ summary: 'Get full lesson content with exercises' })
  async getLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.learningService.getLesson(lessonId, user.id);
  }

  @Post('lessons/:lessonId/start')
  @ApiParam({ name: 'lessonId', type: String })
  @ApiOperation({ summary: 'Start a lesson session' })
  @ApiResponse({ status: 200, description: 'Lesson session started, returns first exercise' })
  async startLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.learningService.startLesson(lessonId, user.id);
  }

  @Post('lessons/:lessonId/complete')
  @ApiParam({ name: 'lessonId', type: String })
  @ApiOperation({ summary: 'Complete a lesson and record results' })
  @ApiResponse({ status: 200, description: 'Lesson completed, returns XP and achievements' })
  async completeLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: { id: string },
    @Body() completionData: {
      score: number;
      timeSpentSeconds: number;
      exerciseResults: Array<{ exerciseId: string; correct: boolean; timeTaken: number }>;
    },
  ) {
    return this.learningService.completeLesson(lessonId, user.id, completionData);
  }

  @Post('exercises/:exerciseId/submit')
  @ApiParam({ name: 'exerciseId', type: String })
  @ApiOperation({ summary: 'Submit an answer for a specific exercise' })
  async submitExerciseAnswer(
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string,
    @CurrentUser() user: { id: string },
    @Body() submission: { answer: string; timeSpentMs: number },
  ) {
    return this.learningService.submitExerciseAnswer(exerciseId, user.id, submission);
  }

  @Get('vocabulary')
  @ApiOperation({ summary: 'Get user vocabulary with SRS status' })
  @ApiQuery({ name: 'status', enum: ['learning', 'review', 'mastered'], required: false })
  @ApiQuery({ name: 'hskLevel', required: false })
  async getVocabulary(
    @CurrentUser() user: { id: string },
    @Query('status') status?: string,
    @Query('hskLevel') hskLevel?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.learningService.getUserVocabulary(user.id, { status, hskLevel, page, limit });
  }

  @Get('review/due')
  @ApiOperation({ summary: 'Get vocabulary items due for SRS review' })
  @ApiResponse({ status: 200, description: 'List of items due for review today' })
  async getDueReviews(@CurrentUser() user: { id: string }) {
    return this.learningService.getDueReviews(user.id);
  }

  @Post('review/submit')
  @ApiOperation({ summary: 'Submit results of a review session' })
  async submitReview(
    @CurrentUser() user: { id: string },
    @Body() reviewData: Array<{ wordId: string; quality: number; timeSpentMs: number }>,
  ) {
    return this.learningService.submitReview(user.id, reviewData);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get detailed learning progress' })
  async getProgress(@CurrentUser() user: { id: string }) {
    return this.learningService.getUserProgress(user.id);
  }

  @Get('daily-lesson')
  @ApiOperation({ summary: 'Get personalized daily lesson recommendation' })
  async getDailyLesson(@CurrentUser() user: { id: string }) {
    return this.learningService.getDailyLesson(user.id);
  }

  @Get('mini-games')
  @ApiOperation({ summary: 'Get available mini-games' })
  async getMiniGames(@CurrentUser() user: { id: string }) {
    return this.learningService.getMiniGames(user.id);
  }

  @Post('mini-games/:gameType/session')
  @ApiParam({ name: 'gameType', enum: ['tone-match', 'character-draw', 'word-chain', 'listening-quiz'] })
  @ApiOperation({ summary: 'Start a mini-game session' })
  async startMiniGame(
    @Param('gameType') gameType: string,
    @CurrentUser() user: { id: string },
    @Body() options: { difficulty?: string; wordCount?: number },
  ) {
    return this.learningService.startMiniGame(gameType, user.id, options);
  }

  @Post('mini-games/session/:sessionId/complete')
  @ApiParam({ name: 'sessionId', type: String })
  @ApiOperation({ summary: 'Complete a mini-game session and record score' })
  async completeMiniGame(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() user: { id: string },
    @Body() results: { score: number; correctAnswers: number; totalQuestions: number },
  ) {
    return this.learningService.completeMiniGame(sessionId, user.id, results);
  }
}
