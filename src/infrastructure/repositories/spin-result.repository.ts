import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { PaginationOptions } from '@domain/common/pagination';
import { SpinResult } from '@domain/entities/spin-result.entity';

import { SpinResultRepository } from '@domain/repositories/spin-result.repository';
import { PrismaTransaction } from '@infrastructure/database/prisma/prisma-unit-of-work';

@Injectable()
export class SpinResultPrismaRepository implements SpinResultRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(
    spinResult: SpinResult,
    tx?: PrismaTransaction,
  ): Promise<SpinResult> {
    const client = tx ?? this.prisma;
    const row = await client.spinResult.create({
      data: {
        id: spinResult.id,
        playerId: spinResult.playerId,
        points: spinResult.points,
        createdAt: spinResult.createdAt,
      },
    });
    return this.toEntity(row);
  }

  async findByPlayerId(
    playerId: string,
    pagination?: PaginationOptions,
  ): Promise<SpinResult[]> {
    const rows = await this.prisma.spinResult.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findAll(pagination?: PaginationOptions): Promise<SpinResult[]> {
    const rows = await this.prisma.spinResult.findMany({
      orderBy: { createdAt: 'desc' },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: {
    id: string;
    playerId: string;
    points: number;
    createdAt: Date;
  }): SpinResult {
    return new SpinResult(row.id, row.playerId, row.points, row.createdAt);
  }
}
