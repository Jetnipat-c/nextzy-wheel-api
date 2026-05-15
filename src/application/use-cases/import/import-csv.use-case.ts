import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';

import { SpinResult } from '@domain/entities/spin-result.entity';
import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';
import type { SpinResultRepository } from '@domain/repositories/spin-result.repository';

import { AppException } from '@application/exceptions/app.exception';

export interface ImportCsvInput {
  buffer: Buffer;
}

export interface ImportCsvOutput {
  imported: number;
  skipped: number;
}

interface CsvRow {
  nickname: string;
  point: string;
  datetime?: string;
}

const BATCH_SIZE = 1000;

@Injectable()
export class ImportCsvUseCase {
  private readonly logger = new Logger(ImportCsvUseCase.name);

  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
    @Inject(SPIN_RESULT_REPOSITORY)
    private readonly spinResultRepository: SpinResultRepository,
  ) {}

  async execute(input: ImportCsvInput): Promise<ImportCsvOutput> {
    const rows = await this.parseCsv(input.buffer);
    const total = rows.length;
    this.logger.log(`CSV parsed — total rows: ${total}`);

    let imported = 0;
    let skipped = 0;
    const affectedPlayerIds = new Set<string>();

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      const validRows = batch.filter((row) => {
        const point = Number(row.point);
        return row.nickname?.trim() && Number.isInteger(point) && point > 0;
      });

      skipped += batch.length - validRows.length;

      if (validRows.length === 0) continue;

      const usernames = [...new Set(validRows.map((r) => r.nickname.trim()))];
      const usernameToId =
        await this.playerRepository.bulkUpsertUsernames(usernames);

      const spinResults: SpinResult[] = validRows.map((row) => {
        const playerId = usernameToId.get(row.nickname.trim())!;
        affectedPlayerIds.add(playerId);
        return new SpinResult(
          crypto.randomUUID(),
          playerId,
          Number(row.point),
          row.datetime ? new Date(row.datetime) : new Date(),
        );
      });

      await this.spinResultRepository.bulkInsert(spinResults);
      imported += spinResults.length;
      this.logger.log(`Progress — ${imported}/${total} imported`);
    }

    if (affectedPlayerIds.size > 0) {
      this.logger.log(
        `Recalculating total points for ${affectedPlayerIds.size} players...`,
      );
      await this.playerRepository.recalculateTotalPoints();
    }

    this.logger.log(
      `Import complete — imported: ${imported}, skipped: ${skipped}`,
    );
    return { imported, skipped };
  }

  private parseCsv(buffer: Buffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const rows: CsvRow[] = [];
      const stream = Readable.from(buffer);

      stream
        .pipe(
          parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
          }),
        )
        .on('data', (row: CsvRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (err) => {
          reject(
            new AppException(
              'CSV_PARSE_ERROR',
              `Failed to parse CSV: ${err.message}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        });
    });
  }
}
