import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { env } from './config/env';
import { DatabaseModule } from './db/pool';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: env().NODE_ENV === 'test' ? 'silent' : env().LOG_LEVEL,
        transport:
          env().NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        redact: ['req.headers.authorization'],
      },
    }),
    DatabaseModule,
    HealthModule,
  ],
})
export class AppModule {}
