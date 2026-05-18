import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import type { PaginatedResult } from '@domain/common/pagination';

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

function isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value &&
    Array.isArray((value as PaginatedResult<unknown>).data)
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormat<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((response) => {
        if (isPaginatedResult(response)) {
          return {
            success: true,
            data: response.data as T,
            meta: response.meta,
          };
        }
        return { success: true, data: response };
      }),
    );
  }
}
