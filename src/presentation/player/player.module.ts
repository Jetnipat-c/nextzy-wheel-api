import { Module } from '@nestjs/common';

import { PlayerController } from '@presentation/player/controllers/player.controller';

import { GetPlayerUseCase } from '@application/use-cases/player/get-player.use-case';
import { LoginPlayerUseCase } from '@application/use-cases/player/login-player.use-case';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import { REWARD_CLAIM_REPOSITORY } from '@domain/repositories/reward-claim.repository';
import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';
import { RewardClaimPrismaRepository } from '@infrastructure/repositories/reward-claim.prisma.repository';

@Module({
  controllers: [PlayerController],
  providers: [
    LoginPlayerUseCase,
    GetPlayerUseCase,
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
export class PlayerModule {}
