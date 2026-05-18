import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorDetail {
  field?: string;
  reason: string;
}

export class AppException extends HttpException {
  readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(
    code: string,
    message: string,
    status = HttpStatus.BAD_REQUEST,
    details?: ErrorDetail[],
  ) {
    super(message, status);
    this.code = code;
    this.details = details;
  }
}
