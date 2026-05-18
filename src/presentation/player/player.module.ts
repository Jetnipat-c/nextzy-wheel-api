import { Module } from '@nestjs/common';

import { PlayerController } from '@presentation/player/controllers/player.controller';

import { GetPlayerUseCase } from '@application/use-cases/player/get-player.use-case';
import { LoginPlayerUseCase } from '@application/use-cases/player/login-player.use-case';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';

@Module({
  controllers: [PlayerController],
  providers: [
    LoginPlayerUseCase,
    GetPlayerUseCase,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerPrismaRepository,
    },
  ],
})
export class PlayerModule {}
