import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Pool } from 'pg';
import { InjectPool } from '../../db/pool';

@Controller()
export class HealthController {
  constructor(@InjectPool() private readonly pool: Pool) {}

  @Get('healthz')
  async healthz(): Promise<{ status: 'ok'; db: 'ok' }> {
    try {
      await this.pool.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({ status: 'error', db: 'unreachable' });
    }
    return { status: 'ok', db: 'ok' };
  }
}
