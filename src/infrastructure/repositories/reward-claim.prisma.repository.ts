import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

import { RewardClaim } from '@domain/entities/reward-claim.entity';

import { RewardClaimRepository } from '@domain/repositories/reward-claim.repository';

@Injectable()
export class RewardClaimPrismaRepository implements RewardClaimRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(rewardClaim: RewardClaim): Promise<RewardClaim> {
    const row = await this.prisma.rewardClaim.create({
      data: {
        id: rewardClaim.id,
        playerId: rewardClaim.playerId,
        points: rewardClaim.points,
        claimedAt: rewardClaim.claimedAt,
      },
    });
    return this.toEntity(row);
  }

  async findByPlayerId(playerId: string): Promise<RewardClaim[]> {
    const rows = await this.prisma.rewardClaim.findMany({
      where: { playerId },
    });
    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: {
    id: string;
    playerId: string;
    points: number;
    claimedAt: Date;
  }): RewardClaim {
    return new RewardClaim(row.id, row.playerId, row.points, row.claimedAt);
  }
}
