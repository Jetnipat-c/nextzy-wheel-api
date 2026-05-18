import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AppException } from '@application/exceptions/app.exception';

import { Player } from '@domain/entities/player.entity';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';

export interface GetPlayerInput {
  id: string;
}

@Injectable()
export class GetPlayerUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(input: GetPlayerInput): Promise<Player> {
    const player = await this.playerRepository.findById(input.id);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return player;
  }
}
