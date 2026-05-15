import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import {
  SpinResult,
  WHEEL_SEGMENTS,
} from '@domain/entities/spin-result.entity';
import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';
import type { SpinResultRepository } from '@domain/repositories/spin-result.repository';

import { AppException } from '@presentation/common/exceptions/app.exception';

import { PrismaUnitOfWork } from '@infrastructure/database/prisma/prisma-unit-of-work';

export interface RecordSpinInput {
  playerId: string;
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

    const points =
      WHEEL_SEGMENTS[Math.floor(Math.random() * WHEEL_SEGMENTS.length)];

    const spinResult = new SpinResult(
      crypto.randomUUID(),
      input.playerId,
      points,
      new Date(),
    );

    player.addPoints(points);

    await this.unitOfWork.execute(async (tx) => {
      await this.spinResultRepository.save(spinResult, tx);
      await this.playerRepository.save(player, tx);
    });

    return spinResult;
  }
}
