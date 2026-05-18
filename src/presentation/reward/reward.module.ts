import { Module } from '@nestjs/common';

import { ClaimRewardUseCase } from '@application/use-cases/reward/claim-reward.use-case';
import { GetMyRewardsUseCase } from '@application/use-cases/reward/get-my-rewards.use-case';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import { REWARD_CLAIM_REPOSITORY } from '@domain/repositories/reward-claim.repository';

import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';
import { RewardClaimPrismaRepository } from '@infrastructure/repositories/reward-claim.prisma.repository';

import { RewardController } from '@presentation/reward/controllers/reward.controller';

@Module({
  controllers: [RewardController],
  providers: [
    ClaimRewardUseCase,
    GetMyRewardsUseCase,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerPrismaRepository,
    },
    {
      provide: REWARD_CLAIM_REPOSITORY,
      useClass: RewardClaimPrismaRepository,
    },
  ],
})
export class RewardModule {}
