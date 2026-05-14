import { RewardClaim } from '@domain/entities/reward-claim.entity';

export const REWARD_CLAIM_REPOSITORY = Symbol('REWARD_CLAIM_REPOSITORY');

export interface RewardClaimRepository {
  create(rewardClaim: RewardClaim): Promise<RewardClaim>;
  findByPlayerId(playerId: string): Promise<RewardClaim[]>;
}
