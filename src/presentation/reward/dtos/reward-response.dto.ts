import type { RewardClaim } from '@domain/entities/reward-claim.entity';

export class RewardResponseDto {
  id: string;
  player_id: string;
  points: number;
  claimed_at: Date;

  static fromEntity(rewardClaim: RewardClaim): RewardResponseDto {
    const dto = new RewardResponseDto();
    dto.id = rewardClaim.id;
    dto.player_id = rewardClaim.playerId;
    dto.points = rewardClaim.points;
    dto.claimed_at = rewardClaim.claimedAt;
    return dto;
  }
}
