import { z } from 'zod';

const positiveInt = z.coerce.number().int().positive();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//, 'must be a postgres:// connection string'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_KEY: z.string().min(16, 'must be at least 16 characters'),
  WORKER_CONCURRENCY: positiveInt.default(8),
  CLAIM_BATCH: positiveInt.default(20),
  VISIBILITY_TIMEOUT_MS: positiveInt.default(30_000),
  REAPER_INTERVAL_MS: positiveInt.default(5_000),
  PER_ENDPOINT_CAP: positiveInt.default(5),
  DELIVERY_TIMEOUT_MS: positiveInt.default(10_000),
  DEMO_MODE: z.stringbool().default(false),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type Env = z.infer<typeof EnvSchema>;

/** Parse an env source. Throws with every invalid key listed. */
export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return result.data;
}

let cached: Env | undefined;

/** The single place process.env is read. Crashes the process on invalid config. */
export function env(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
