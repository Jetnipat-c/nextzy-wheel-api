import {
  Catch,
  HttpStatus,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

import { AppException } from '@presentation/common/exceptions/app.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    const code =
      exception instanceof AppException ? exception.code : 'INTERNAL_ERROR';

    const details =
      exception instanceof AppException
        ? exception.details
        : exception instanceof HttpException
          ? this.extractValidationDetails(exception)
          : undefined;

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
      },
    });
  }

  private extractValidationDetails(exception: HttpException) {
    const res = exception.getResponse() as Record<string, unknown>;
    if (!Array.isArray(res.message)) return undefined;
    return res.message.map((reason: string) => ({ reason }));
  }
}
