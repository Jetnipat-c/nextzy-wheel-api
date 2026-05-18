export class RewardClaim {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly points: number,
    public readonly claimedAt: Date,
  ) {}
}
