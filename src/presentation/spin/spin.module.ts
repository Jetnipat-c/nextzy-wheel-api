import { Module } from '@nestjs/common';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';

import { PrismaUnitOfWork } from '@infrastructure/database/prisma/prisma-unit-of-work';
import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';
import { SpinResultPrismaRepository } from '@infrastructure/repositories/spin-result.repository';

import { SpinController } from '@presentation/spin/controllers/spin.controller';
import { GlobalSpinController } from '@presentation/spin/controllers/global-spin.controller';

import { RecordSpinUseCase } from '@application/use-cases/spin/spin-wheel.use-case';
import { GetMySpinsUseCase } from '@application/use-cases/spin/get-my-spins.use-case';
import { GetGlobalSpinsUseCase } from '@application/use-cases/spin/get-global-spins.use-case';

@Module({
  controllers: [SpinController, GlobalSpinController],
  providers: [
    RecordSpinUseCase,
    GetMySpinsUseCase,
    GetGlobalSpinsUseCase,
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
