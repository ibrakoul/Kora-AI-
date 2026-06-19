import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsIn,
  IsBoolean,
  MinLength,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Unique username',
    example: 'mandarin_learner',
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  username?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Passionate Mandarin learner from New York!',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'User native language (ISO 639-1 code)',
    example: 'en',
    enum: ['en', 'fr', 'es', 'de', 'pt', 'ja', 'ko', 'ar', 'ru', 'it'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'fr', 'es', 'de', 'pt', 'ja', 'ko', 'ar', 'ru', 'it'])
  nativeLanguage?: string;

  @ApiPropertyOptional({
    description: 'User timezone (IANA timezone name)',
    example: 'America/New_York',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Daily learning goal in minutes',
    example: 20,
  })
  @IsOptional()
  dailyGoalMinutes?: number;

  @ApiPropertyOptional({
    description: 'Whether to receive push notifications',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  pushNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Push notification token for device',
    example: 'ExponentPushToken[xxxxxx]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  pushToken?: string;

  @ApiPropertyOptional({
    description: 'External avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;
}
