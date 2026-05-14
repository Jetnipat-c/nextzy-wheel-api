import { Module } from '@nestjs/common';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';

import { PlayerController } from '@presentation/player/controllers/player.controller';

import { LoginPlayerUseCase } from '@application/use-cases/player/login-player.use-case';

import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';

@Module({
  controllers: [PlayerController],
  providers: [
    LoginPlayerUseCase,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerPrismaRepository,
    },
  ],
})
export class PlayerModule {}
