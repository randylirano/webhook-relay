import { parseEnv } from '../../src/config/env';

const valid = {
  DATABASE_URL: 'postgres://u:p@localhost:5432/db',
  API_KEY: 'x'.repeat(16),
};

describe('parseEnv', () => {
  it('applies the spec defaults', () => {
    const env = parseEnv(valid);
    expect(env).toMatchObject({
      PORT: 3000,
      WORKER_CONCURRENCY: 8,
      CLAIM_BATCH: 20,
      VISIBILITY_TIMEOUT_MS: 30_000,
      REAPER_INTERVAL_MS: 5_000,
      PER_ENDPOINT_CAP: 5,
      DELIVERY_TIMEOUT_MS: 10_000,
      DEMO_MODE: false,
    });
  });

  it('coerces numbers and booleans from strings', () => {
    const env = parseEnv({ ...valid, WORKER_CONCURRENCY: '4', DEMO_MODE: 'true' });
    expect(env.WORKER_CONCURRENCY).toBe(4);
    expect(env.DEMO_MODE).toBe(true);
  });

  it('rejects a missing DATABASE_URL, a short API_KEY and a zero CLAIM_BATCH', () => {
    expect(() => parseEnv({ API_KEY: 'short', CLAIM_BATCH: '0' })).toThrow(
      /DATABASE_URL[\s\S]*API_KEY[\s\S]*CLAIM_BATCH/,
    );
  });
});
