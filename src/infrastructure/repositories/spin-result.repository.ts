import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { PrismaTransaction } from '@infrastructure/database/prisma/prisma-unit-of-work';

import {
  SpinResult,
  SpinResultWithUsername,
} from '@domain/entities/spin-result.entity';
import { PaginatedResult, PaginationOptions } from '@domain/common/pagination';
import { SpinResultRepository } from '@domain/repositories/spin-result.repository';

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

  async bulkInsert(spinResults: SpinResult[]): Promise<void> {
    await this.prisma.spinResult.createMany({
      data: spinResults.map((s) => ({
        id: s.id,
        playerId: s.playerId,
        points: s.points,
        createdAt: s.createdAt,
      })),
      skipDuplicates: true,
    });
  }

  async findByPlayerId(
    playerId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<SpinResult>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.spinResult.findMany({
        where: { playerId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.spinResult.count({ where: { playerId } }),
    ]);

    return {
      data: rows.map((row) => this.toEntity(row)),
      meta: {
        total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
    };
  }

  async findAll(
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<SpinResultWithUsername>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.spinResult.findMany({
        include: { player: { select: { username: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.spinResult.count(),
    ]);

    return {
      data: rows.map((row) => ({
        ...this.toEntity(row),
        username: row.player.username,
      })),
      meta: {
        total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
    };
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
