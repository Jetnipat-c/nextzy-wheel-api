import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AppException } from '@application/exceptions/app.exception';

import { PrismaUnitOfWork } from '@infrastructure/database/prisma/prisma-unit-of-work';

import { SpinResult } from '@domain/entities/spin-result.entity';
import { WHEEL_SEGMENTS } from '@domain/constants/game.constants';
import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';
import type { SpinResultRepository } from '@domain/repositories/spin-result.repository';

export interface RecordSpinInput {
  playerId: string;
  points: number;
}

@Injectable()
export class RecordSpinUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
    @Inject(SPIN_RESULT_REPOSITORY)
    private readonly spinResultRepository: SpinResultRepository,
    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  async execute(input: RecordSpinInput) {
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!WHEEL_SEGMENTS.includes(input.points)) {
      throw new AppException(
        'INVALID_SPIN_POINTS',
        `Points must be one of: ${WHEEL_SEGMENTS.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const spinResult = new SpinResult(
      crypto.randomUUID(),
      input.playerId,
      input.points,
      new Date(),
    );

    player.addPoints(input.points);

    await this.unitOfWork.execute(async (tx) => {
      await this.spinResultRepository.save(spinResult, tx);
      await this.playerRepository.save(player, tx);
    });

    return spinResult;
  }
}
