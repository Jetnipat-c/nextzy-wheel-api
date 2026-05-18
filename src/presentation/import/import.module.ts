import { Module } from '@nestjs/common';

import { PLAYER_BULK_REPOSITORY } from '@domain/repositories/player-bulk.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';

import { PlayerPrismaRepository } from '@infrastructure/repositories/player.prisma.repository';
import { SpinResultPrismaRepository } from '@infrastructure/repositories/spin-result.repository';

import { ImportCsvUseCase } from '@application/use-cases/import/import-csv.use-case';

import { ImportController } from '@presentation/import/controllers/import.controller';

@Module({
  controllers: [ImportController],
  providers: [
    ImportCsvUseCase,
    {
      provide: PLAYER_BULK_REPOSITORY,
      useClass: PlayerPrismaRepository,
    },
    {
      provide: SPIN_RESULT_REPOSITORY,
      useClass: SpinResultPrismaRepository,
    },
  ],
})
export class ImportModule {}
