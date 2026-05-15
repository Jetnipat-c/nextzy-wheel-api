import {
  Controller,
  ConsoleLogger,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';

import { AppException } from '@application/exceptions/app.exception';
import { ImportCsvUseCase } from '@application/use-cases/import/import-csv.use-case';

@Controller('import')
export class ImportController {
  private readonly logger = new ConsoleLogger(ImportController.name);

  constructor(
    private readonly importCsvUseCase: ImportCsvUseCase,
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
  ) {}

  @Post('csv')
  @Version('1')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file'))
  importCsv(@UploadedFile() file: Express.Multer.File): { message: string } {
    if (!file) {
      throw new AppException(
        'FILE_REQUIRED',
        'CSV file is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.importCsvUseCase
      .execute({ buffer: file.buffer })
      .then(({ imported, skipped }) => {
        this.logger.log(
          `CSV import done — imported: ${imported}, skipped: ${skipped}`,
        );
      })
      .catch((err: unknown) => {
        this.logger.error(
          'CSV import failed',
          err instanceof Error ? err.stack : err,
        );
      });

    return { message: 'Import started' };
  }

  @Post('recalculate-points')
  @Version('1')
  async recalculatePoints(): Promise<{ message: string }> {
    await this.playerRepository.recalculateTotalPoints();
    return { message: 'Recalculation done' };
  }
}
