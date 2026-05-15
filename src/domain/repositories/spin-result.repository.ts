import { PaginationOptions } from '@domain/common/pagination';
import { SpinResult } from '@domain/entities/spin-result.entity';

export const SPIN_RESULT_REPOSITORY = Symbol('SPIN_RESULT_REPOSITORY');

export interface SpinResultRepository {
  save(spinResult: SpinResult, tx?: unknown): Promise<SpinResult>;
  findByPlayerId(
    playerId: string,
    pagination?: PaginationOptions,
  ): Promise<SpinResult[]>;
  findAll(pagination?: PaginationOptions): Promise<SpinResult[]>;
}
