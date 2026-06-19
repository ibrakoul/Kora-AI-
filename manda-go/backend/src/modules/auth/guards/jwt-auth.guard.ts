import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check for @Public() decorator - skip auth for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Handle specific JWT errors with descriptive messages
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access token has expired. Please refresh your token.');
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid access token. Please login again.');
    }

    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      this.logger.warn(
        `Unauthorized access attempt to ${request.method} ${request.url} - ${info?.message || err?.message || 'No token provided'}`,
      );
      throw new UnauthorizedException(err?.message || 'Authentication required');
    }

    return user;
  }
}
