import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ProblemFilter } from './common/problem';

/** Shared by main.ts and the integration tests so both run the same app. */
export function configureApp(app: INestApplication): INestApplication {
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  app.useGlobalFilters(new ProblemFilter());

  const config = new DocumentBuilder()
    .setTitle('Webhook Relay')
    .setDescription(
      'Outbound webhooks: HMAC-signed payloads, exponential-backoff retries, DLQ and replay',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));

  return app;
}
