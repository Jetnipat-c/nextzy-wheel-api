export class Player {
  static readonly MAX_POINTS = 10000;

  constructor(
    public readonly id: string,
    public readonly username: string,
    public totalPoints: number,
    public readonly createdAt: Date,
  ) {}

  addPoints(points: number): void {
    this.totalPoints = Math.min(this.totalPoints + points, Player.MAX_POINTS);
  }

  isMaxPoints(): boolean {
    return this.totalPoints >= Player.MAX_POINTS;
  }
}

export interface PlayerWithRewards {
  id: string;
  username: string;
  totalPoints: number;
  createdAt: Date;
  rewards: {
    points: number;
    claimed: boolean;
  }[];
}
