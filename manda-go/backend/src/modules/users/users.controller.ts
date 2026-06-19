import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user complete profile' })
  @ApiResponse({ status: 200, description: 'User profile with learning stats' })
  async getMyProfile(@CurrentUser() user: { id: string }) {
    return this.usersService.getFullProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Only image files (jpg, png, webp) are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar image' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully' })
  async uploadAvatar(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user learning statistics' })
  @ApiResponse({ status: 200, description: 'Learning statistics' })
  async getLearningStats(@CurrentUser() user: { id: string }) {
    return this.usersService.getLearningStats(user.id);
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get current user streak information' })
  @ApiResponse({ status: 200, description: 'Streak data' })
  async getStreak(@CurrentUser() user: { id: string }) {
    return this.usersService.getStreakInfo(user.id);
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get user achievements and badges' })
  @ApiResponse({ status: 200, description: 'List of achievements' })
  async getAchievements(@CurrentUser() user: { id: string }) {
    return this.usersService.getAchievements(user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard with nearby users' })
  @ApiQuery({ name: 'type', enum: ['global', 'friends', 'league'], required: false })
  @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly', 'all-time'], required: false })
  async getLeaderboard(
    @CurrentUser() user: { id: string },
    @Query('type') type: string = 'global',
    @Query('period') period: string = 'weekly',
    @Query('limit') limit: number = 50,
  ) {
    return this.usersService.getLeaderboard(user.id, type, period, limit);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'unread', type: Boolean, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async getNotifications(
    @CurrentUser() user: { id: string },
    @Query('unread') unread: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.usersService.getNotifications(user.id, { unread, page, limit });
  }

  @Patch('notifications/read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllNotificationsRead(@CurrentUser() user: { id: string }) {
    await this.usersService.markAllNotificationsRead(user.id);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update user app settings and preferences' })
  async updateSettings(
    @CurrentUser() user: { id: string },
    @Body() settings: Record<string, any>,
  ) {
    return this.usersService.updateSettings(user.id, settings);
  }

  @Delete('account')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user account permanently' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  async deleteAccount(
    @CurrentUser() user: { id: string },
    @Body('password') password: string,
    @Body('reason') reason?: string,
  ) {
    if (!password) {
      throw new BadRequestException('Password confirmation is required to delete your account');
    }
    await this.usersService.deleteAccount(user.id, password, reason);
  }

  // Admin-only endpoints
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] List all users with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ page, limit, search });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  @ApiOperation({ summary: '[Admin] Get a specific user by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/ban')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiParam({ name: 'id', type: String, description: 'User UUID' })
  @ApiOperation({ summary: '[Admin] Ban a user' })
  async banUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: { id: string },
  ) {
    return this.usersService.banUser(id, reason, admin.id);
  }
}
