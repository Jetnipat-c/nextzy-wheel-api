import { Injectable } from '@nestjs/common';

import { Player } from '@domain/entities/player.entity';
import type { PlayerRepository } from '@domain/repositories/player.repository';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { PrismaTransaction } from '@infrastructure/database/prisma/prisma-unit-of-work';

@Injectable()
export class PlayerPrismaRepository implements PlayerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Player | null> {
    const row = await this.prisma.player.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async findByUsername(username: string): Promise<Player | null> {
    const row = await this.prisma.player.findFirst({ where: { username } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async save(player: Player, tx?: PrismaTransaction): Promise<Player> {
    const client = tx ?? this.prisma;
    const row = await client.player.upsert({
      where: { id: player.id },
      create: {
        id: player.id,
        username: player.username,
        totalPoints: player.totalPoints,
        createdAt: player.createdAt,
      },
      update: {
        totalPoints: player.totalPoints,
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: string;
    username: string;
    totalPoints: number;
    createdAt: Date;
  }): Player {
    return new Player(row.id, row.username, row.totalPoints, row.createdAt);
  }
}
