import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  var __PG_CONTAINER__: StartedPostgreSqlContainer | undefined;
}

/**
 * Starts one real Postgres 17 for the whole Jest run (never SQLite, never mocks: the
 * SKIP LOCKED guarantees depend on real Postgres locking), applies migrations with the
 * same CLI production uses, and exports DATABASE_URL to the test workers.
 */
export default async function globalSetup(): Promise<void> {
  const container = await new PostgreSqlContainer('postgres:17-alpine')
    .withDatabase('relay_test')
    .withUsername('relay')
    .withPassword('relay')
    .start();
  globalThis.__PG_CONTAINER__ = container;

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = container.getConnectionUri();
  process.env.API_KEY ??= 'test-api-key-0123456789abcdef';

  const root = path.resolve(__dirname, '../..');
  execFileSync(
    path.join(root, 'node_modules/.bin/node-pg-migrate'),
    ['up', '-m', 'src/migrations'],
    { cwd: root, env: process.env, stdio: 'pipe' },
  );
}
