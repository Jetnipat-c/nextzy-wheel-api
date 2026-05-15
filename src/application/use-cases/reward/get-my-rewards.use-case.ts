import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { REWARD_CLAIM_REPOSITORY } from '@domain/repositories/reward-claim.repository';
import type { RewardClaimRepository } from '@domain/repositories/reward-claim.repository';

import { AppException } from '@application/exceptions/app.exception';

export interface GetMyRewardsInput {
  playerId: string;
}

@Injectable()
export class GetMyRewardsUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
    @Inject(REWARD_CLAIM_REPOSITORY)
    private readonly rewardClaimRepository: RewardClaimRepository,
  ) {}

  async execute(input: GetMyRewardsInput) {
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.rewardClaimRepository.findByPlayerId(input.playerId);
  }
}
