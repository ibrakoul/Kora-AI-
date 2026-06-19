import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      issuer: 'mandago.app',
      audience: 'mandago-users',
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, tokenVersion } = payload;

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found or token is invalid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Validate token version to support global logout (revoke all sessions)
    if (user.tokenVersion !== tokenVersion) {
      throw new UnauthorizedException('Token has been invalidated. Please login again.');
    }

    this.logger.debug(`JWT validated for user: ${userId}`);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      subscriptionTier: user.subscriptionTier,
    };
  }
}
