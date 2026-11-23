import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';
import { env } from '../config/env';

export const PG_POOL = Symbol('PG_POOL');

/** Inject the shared pg Pool: `constructor(@InjectPool() private readonly pool: Pool) {}` */
export const InjectPool = () => Inject(PG_POOL);

export function createPool(connectionString = env().DATABASE_URL): Pool {
  // int8/bigint columns come back as strings from node-postgres; convert at the repository edge.
  return new Pool({ connectionString, max: 20 });
}

@Global()
@Module({
  providers: [{ provide: PG_POOL, useFactory: () => createPool() }],
  exports: [PG_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@InjectPool() private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
