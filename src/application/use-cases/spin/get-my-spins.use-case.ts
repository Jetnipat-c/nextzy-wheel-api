import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { PaginationOptions } from '@domain/common/pagination';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';
import type { SpinResultRepository } from '@domain/repositories/spin-result.repository';

import { AppException } from '@application/exceptions/app.exception';

export interface GetMySpinsInput {
  playerId: string;
  pagination?: PaginationOptions;
}

@Injectable()
export class GetMySpinsUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
    @Inject(SPIN_RESULT_REPOSITORY)
    private readonly spinResultRepository: SpinResultRepository,
  ) {}

  async execute(input: GetMySpinsInput) {
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.spinResultRepository.findByPlayerId(
      input.playerId,
      input.pagination,
    );

    return {
      ...result,
      data: result.data.map((spin) => ({ ...spin, username: player.username })),
    };
  }
}
