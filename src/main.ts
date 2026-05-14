import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, VersioningType } from '@nestjs/common';

import { configuration } from '@infrastructure/config/configuration';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new ConsoleLogger();

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  const port = configuration().app.port;
  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
