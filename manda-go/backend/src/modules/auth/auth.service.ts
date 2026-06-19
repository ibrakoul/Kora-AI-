import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MINUTES = 30;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async register(registerDto: RegisterDto, ip: string, userAgent: string) {
    const { email, password, username, firstName, lastName, nativeLanguage } = registerDto;

    // Check if email already exists
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('An account with this email address already exists');
    }

    // Check if username already exists
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('This username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      nativeLanguage: nativeLanguage || 'en',
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // Queue verification email
    await this.emailQueue.add(
      'send-verification-email',
      {
        to: email,
        firstName,
        verificationToken,
        verificationUrl: `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`,
      },
      { delay: 1000 },
    );

    // Emit registration event
    this.eventEmitter.emit('user.registered', {
      userId: user.id,
      email,
      ip,
      userAgent,
      timestamp: new Date(),
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`New user registered: ${email} (${user.id})`);

    return {
      message: 'Registration successful. Please verify your email.',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const { email, password, rememberMe } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is temporarily locked. Try again in ${remainingMinutes} minutes.`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    // Reset failed login attempts
    await this.usersService.resetLoginAttempts(user.id);

    // Update last login
    await this.usersService.updateLastLogin(user.id, ip);

    // Generate tokens
    const expiresIn = rememberMe
      ? this.configService.get<string>('JWT_REFRESH_EXPIRATION_EXTENDED', '30d')
      : this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');

    const tokens = await this.generateTokens(user, expiresIn);

    // Emit login event
    this.eventEmitter.emit('user.logged_in', {
      userId: user.id,
      ip,
      userAgent,
      timestamp: new Date(),
    });

    this.logger.log(`User logged in: ${email} from ${ip}`);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);

    return {
      message: 'Tokens refreshed successfully',
      ...tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.clearRefreshToken(userId);
    this.eventEmitter.emit('user.logged_out', { userId, timestamp: new Date() });
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerificationExpiry < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    await this.usersService.markEmailAsVerified(user.id);

    this.eventEmitter.emit('user.email_verified', {
      userId: user.id,
      email: user.email,
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await this.usersService.setPasswordResetToken(user.id, hashedToken, resetExpiry);

    await this.emailQueue.add('send-password-reset-email', {
      to: email,
      firstName: user.firstName,
      resetUrl: `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`,
    });

    this.logger.log(`Password reset requested for: ${email}`);

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user || user.passwordResetExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Invalidate all sessions
    await this.usersService.clearRefreshToken(user.id);

    await this.emailQueue.add('send-password-changed-email', {
      to: user.email,
      firstName: user.firstName,
    });

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.usersService.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user: this.sanitizeUser(user) };
  }

  async googleAuth(idToken: string) {
    try {
      // Verify Google token via Firebase Admin
      const decodedToken = await this.verifyGoogleToken(idToken);
      const { email, name, picture, uid: googleId } = decodedToken;

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        const [firstName, ...lastNameParts] = (name || '').split(' ');
        user = await this.usersService.create({
          email,
          firstName: firstName || '',
          lastName: lastNameParts.join(' ') || '',
          username: await this.generateUniqueUsername(email),
          googleId,
          avatarUrl: picture,
          isEmailVerified: true,
          password: await bcrypt.hash(uuidv4(), this.SALT_ROUNDS),
        });
      } else if (!user.googleId) {
        await this.usersService.linkGoogleAccount(user.id, googleId);
      }

      const tokens = await this.generateTokens(user);
      return { message: 'Authentication successful', user: this.sanitizeUser(user), ...tokens };
    } catch (error) {
      this.logger.error('Google authentication failed', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async appleAuth(identityToken: string, authorizationCode: string) {
    try {
      // Verify Apple identity token
      const payload = await this.verifyAppleToken(identityToken);
      const { email, sub: appleId } = payload;

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.create({
          email: email || `${appleId}@privaterelay.appleid.com`,
          firstName: '',
          lastName: '',
          username: await this.generateUniqueUsername(email || appleId),
          appleId,
          isEmailVerified: true,
          password: await bcrypt.hash(uuidv4(), this.SALT_ROUNDS),
        });
      } else if (!user.appleId) {
        await this.usersService.linkAppleAccount(user.id, appleId);
      }

      const tokens = await this.generateTokens(user);
      return { message: 'Authentication successful', user: this.sanitizeUser(user), ...tokens };
    } catch (error) {
      this.logger.error('Apple authentication failed', error);
      throw new UnauthorizedException('Apple authentication failed');
    }
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.usersService.clearRefreshToken(userId);
    await this.usersService.incrementTokenVersion(userId);
  }

  private async generateTokens(user: User, refreshExpiration?: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: user.id, tokenVersion: user.tokenVersion },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: refreshExpiration || this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
        },
      ),
    ]);

    // Hash and store refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  private async handleFailedLogin(user: User): Promise<void> {
    const attempts = (user.failedLoginAttempts || 0) + 1;

    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutUntil = new Date(Date.now() + this.LOCK_DURATION_MINUTES * 60 * 1000);
      await this.usersService.lockAccount(user.id, lockoutUntil);
    } else {
      await this.usersService.incrementFailedLoginAttempts(user.id, attempts);
    }
  }

  private sanitizeUser(user: User) {
    const { password, refreshTokenHash, emailVerificationToken, passwordResetToken, ...sanitized } = user as any;
    return sanitized;
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let username = base;
    let counter = 1;

    while (await this.usersService.findByUsername(username)) {
      username = `${base}${counter}`;
      counter++;
    }

    return username;
  }

  private async verifyGoogleToken(idToken: string): Promise<any> {
    // Implementation uses Firebase Admin SDK
    throw new InternalServerErrorException('Google token verification not configured');
  }

  private async verifyAppleToken(identityToken: string): Promise<any> {
    // Implementation uses Apple's public keys
    throw new InternalServerErrorException('Apple token verification not configured');
  }
}
