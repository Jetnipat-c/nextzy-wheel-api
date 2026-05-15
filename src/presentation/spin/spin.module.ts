import { Module } from '@nestjs/common';

import { RecordSpinUseCase } from '@application/use-cases/spin/spin-wheel.use-case';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';

import { PrismaUnitOfWork } from '@infrastructure/database/prisma/prisma-unit-of-work';

import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';
import { SpinResultPrismaRepository } from '@infrastructure/repositories/spin-result.repository';

import { SpinController } from '@presentation/spin/controllers/spin.controller';

@Module({
  controllers: [SpinController],
  providers: [
    RecordSpinUseCase,
    PrismaUnitOfWork,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerPrismaRepository,
    },
    {
      provide: SPIN_RESULT_REPOSITORY,
      useClass: SpinResultPrismaRepository,
    },
  ],
})
export class SpinModule {}
