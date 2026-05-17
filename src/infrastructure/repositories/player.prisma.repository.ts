import { Injectable } from '@nestjs/common';

import { Player } from '@domain/entities/player.entity';
import type { PlayerRepository } from '@domain/repositories/player.repository';
import type { PlayerBulkRepository } from '@domain/repositories/player-bulk.repository';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { PrismaTransaction } from '@infrastructure/database/prisma/prisma-unit-of-work';

@Injectable()
export class PlayerPrismaRepository
  implements PlayerRepository, PlayerBulkRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Player | null> {
    const row = await this.prisma.player.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async findByUsername(username: string): Promise<Player | null> {
    const row = await this.prisma.player.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
    if (!row) return null;
    return this.toEntity(row);
  }

  async upsertByUsername(username: string): Promise<Player> {
    const existing = await this.prisma.player.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
    if (existing) return this.toEntity(existing);

    const row = await this.prisma.player.create({
      data: {
        id: crypto.randomUUID(),
        username,
        totalPoints: 0,
        createdAt: new Date(),
      },
    });
    return this.toEntity(row);
  }

  async bulkUpsertUsernames(usernames: string[]): Promise<Map<string, string>> {
    const lowerUsernames = usernames.map((u) => u.toLowerCase());
    const existing = await this.prisma.$queryRaw<
      { id: string; username: string }[]
    >`SELECT id, username FROM players WHERE LOWER(username) = ANY(${lowerUsernames}::text[])`;

    const lowerToId = new Map<string, string>(
      existing.map((p) => [p.username.toLowerCase(), p.id]),
    );

    const map = new Map<string, string>();
    for (const u of usernames) {
      const id = lowerToId.get(u.toLowerCase());
      if (id) map.set(u, id);
    }

    const newUsernames = usernames.filter(
      (u) => !lowerToId.has(u.toLowerCase()),
    );
    if (newUsernames.length > 0) {
      const now = new Date();
      const newPlayers = newUsernames.map((u) => ({
        id: crypto.randomUUID(),
        username: u,
        totalPoints: 0,
        createdAt: now,
      }));
      await this.prisma.player.createMany({
        data: newPlayers,
        skipDuplicates: true,
      });
      for (const p of newPlayers) {
        map.set(p.username, p.id);
      }
    }

    return map;
  }

  async recalculateTotalPoints(): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE players
      SET total_points = LEAST(s.total, ${Player.MAX_POINTS})
      FROM (
        SELECT player_id, SUM(points_earned) AS total
        FROM spin_results
        GROUP BY player_id
      ) s
      WHERE players.id = s.player_id
    `;
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
