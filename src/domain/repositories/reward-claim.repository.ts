import { RewardClaim } from '@domain/entities/reward-claim.entity';

export const REWARD_CLAIM_REPOSITORY = Symbol('REWARD_CLAIM_REPOSITORY');

export interface RewardClaimRepository {
  claim(rewardClaim: RewardClaim): Promise<RewardClaim>;
  findByPlayerId(playerId: string): Promise<RewardClaim[]>;
  findByPlayerIdAndPoints(
    playerId: string,
    points: number,
  ): Promise<RewardClaim | null>;
}
