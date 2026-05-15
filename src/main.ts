import {
  HttpStatus,
  ConsoleLogger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { configuration } from '@infrastructure/config/configuration';

import { AppException } from '@application/exceptions/app.exception';

import { AllExceptionsFilter } from '@presentation/common/filters/all-exception.filter';
import { ResponseInterceptor } from '@presentation/common/interceptors/response.interceptor';

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const details = errors.map((error) => ({
          field: error.property,
          reason: Object.values(error.constraints ?? {}).join(', '),
        }));
        return new AppException(
          'VALIDATION_ERROR',
          'Validation failed',
          HttpStatus.BAD_REQUEST,
          details,
        );
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = configuration().app.port;
  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
