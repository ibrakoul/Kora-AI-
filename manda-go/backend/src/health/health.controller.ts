import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

/**
 * Health check endpoints — used by load balancers, Kubernetes probes, and
 * monitoring tools. No authentication required.
 */
@Controller('api/v1/health')
@SkipThrottle()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly appVersion: string;

  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly configService: ConfigService,
  ) {
    this.appVersion = this.configService.get<string>('APP_VERSION', '1.0.0');
  }

  /**
   * GET /api/v1/health
   * Summary endpoint — returns static status without hitting external deps.
   * Ideal for a quick "is the server alive?" check.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: this.appVersion,
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      uptime: Math.floor(process.uptime()),
    };
  }

  /**
   * GET /api/v1/health/ready
   * Readiness probe — checks that all required dependencies are available.
   * Returns 503 if any critical dependency is down.
   */
  @Get('ready')
  @HealthCheck()
  async getReadiness() {
    return this.health.check([
      // PostgreSQL connectivity
      () => this.db.pingCheck('database', { timeout: 3000 }),

      // Memory usage — warn when RSS exceeds 512 MB
      () => this.memory.checkRSS('memory_rss', 512 * 1024 * 1024),

      // Memory heap — warn when heap exceeds 256 MB
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
    ]);
  }

  /**
   * GET /api/v1/health/live
   * Liveness probe — a lightweight ping that always returns OK as long as
   * the Node.js process is running. Does NOT check external dependencies.
   */
  @Get('live')
  @HttpCode(HttpStatus.OK)
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    };
  }

  /**
   * GET /api/v1/health/metrics
   * Lightweight runtime metrics snapshot (not a full Prometheus endpoint).
   */
  @Get('metrics')
  @HttpCode(HttpStatus.OK)
  getMetrics() {
    const mem = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: this.appVersion,
      memory: {
        rssMB: Math.round(mem.rss / 1024 / 1024),
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        externalMB: Math.round(mem.external / 1024 / 1024),
      },
      cpu: {
        userMs: Math.round(cpuUsage.user / 1000),
        systemMs: Math.round(cpuUsage.system / 1000),
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  }
}
