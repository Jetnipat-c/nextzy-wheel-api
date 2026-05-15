import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AppException } from '@application/exceptions/app.exception';

import { PlayerWithRewards } from '@domain/entities/player.entity';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { REWARD_CLAIM_REPOSITORY } from '@domain/repositories/reward-claim.repository';
import type { RewardClaimRepository } from '@domain/repositories/reward-claim.repository';

export interface GetPlayerInput {
  id: string;
}

@Injectable()
export class GetPlayerUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
    @Inject(REWARD_CLAIM_REPOSITORY)
    private readonly rewardClaimRepository: RewardClaimRepository,
  ) {}

  async execute(input: GetPlayerInput): Promise<PlayerWithRewards> {
    const player = await this.playerRepository.findById(input.id);
    if (!player) {
      throw new AppException(
        'PLAYER_NOT_FOUND',
        'Player with the given ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const rewardClaims = await this.rewardClaimRepository.findByPlayerId(
      input.id,
    );

    const REWARD_POINTS = [500, 1000, 10000];

    return {
      id: player.id,
      username: player.username,
      totalPoints: player.totalPoints,
      createdAt: player.createdAt,
      rewards: REWARD_POINTS.map((points) => ({
        points,
        claimed: rewardClaims.some((claim) => claim.points === points),
      })),
    };
  }
}
