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

import { PLAYER_BULK_REPOSITORY } from '@domain/repositories/player-bulk.repository';
import type { PlayerBulkRepository } from '@domain/repositories/player-bulk.repository';

import { AppException } from '@application/exceptions/app.exception';
import { ImportCsvUseCase } from '@application/use-cases/import/import-csv.use-case';

@Controller('import')
export class ImportController {
  private readonly logger = new ConsoleLogger(ImportController.name);

  constructor(
    private readonly importCsvUseCase: ImportCsvUseCase,
    @Inject(PLAYER_BULK_REPOSITORY)
    private readonly playerRepository: PlayerBulkRepository,
  ) {}

  @Post('csv')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imported: number; skipped: number }> {
    if (!file) {
      throw new AppException(
        'FILE_REQUIRED',
        'CSV file is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.importCsvUseCase.execute({ buffer: file.buffer });
    this.logger.log(
      `CSV import done — imported: ${result.imported}, skipped: ${result.skipped}`,
    );
    return result;
  }

  @Post('recalculate-points')
  @Version('1')
  async recalculatePoints(): Promise<{ message: string }> {
    await this.playerRepository.recalculateTotalPoints();
    return { message: 'Recalculation done' };
  }
}
