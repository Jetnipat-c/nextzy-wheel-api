import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RewardClaim } from '@domain/entities/reward-claim.entity';
import { VALID_CHECKPOINTS } from '@domain/constants/game.constants';
import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { REWARD_CLAIM_REPOSITORY } from '@domain/repositories/reward-claim.repository';
import type { RewardClaimRepository } from '@domain/repositories/reward-claim.repository';

import { AppException } from '@application/exceptions/app.exception';

export interface ClaimRewardInput {
  playerId: string;
  points: number;
}

@Injectable()
export class ClaimRewardUseCase {
  constructor(
    @Inject(REWARD_CLAIM_REPOSITORY)
    private readonly rewardClaimRepository: RewardClaimRepository,
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(input: ClaimRewardInput): Promise<RewardClaim> {
    if (!VALID_CHECKPOINTS.includes(input.points)) {
      throw new AppException(
        'INVALID_CHECKPOINT',
        'Invalid checkpoint points',
        HttpStatus.BAD_REQUEST,
      );
    }

    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (player.totalPoints < input.points) {
      throw new AppException(
        'INSUFFICIENT_POINTS',
        'Player does not have enough points to claim this reward',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.rewardClaimRepository.findByPlayerIdAndPoints(
      input.playerId,
      input.points,
    );
    if (existing) {
      throw new AppException(
        'REWARD_ALREADY_CLAIMED',
        'This checkpoint reward has already been claimed',
        HttpStatus.CONFLICT,
      );
    }

    const rewardClaim = new RewardClaim(
      crypto.randomUUID(),
      input.playerId,
      input.points,
      new Date(),
    );

    try {
      return await this.rewardClaimRepository.claim(rewardClaim);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        throw new AppException(
          'REWARD_ALREADY_CLAIMED',
          'This checkpoint reward has already been claimed',
          HttpStatus.CONFLICT,
        );
      }
      throw e;
    }
  }
}
