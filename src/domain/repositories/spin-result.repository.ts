import {
  SpinResult,
  SpinResultWithUsername,
} from '@domain/entities/spin-result.entity';
import { PaginationOptions, PaginatedResult } from '@domain/common/pagination';

export const SPIN_RESULT_REPOSITORY = Symbol('SPIN_RESULT_REPOSITORY');

export interface SpinResultRepository {
  save(spinResult: SpinResult, tx?: unknown): Promise<SpinResult>;
  bulkInsert(spinResults: SpinResult[]): Promise<void>;
  findByPlayerId(
    playerId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<SpinResult>>;
  findAll(
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<SpinResultWithUsername>>;
}
