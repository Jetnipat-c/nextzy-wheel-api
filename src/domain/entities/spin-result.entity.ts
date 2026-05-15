export const WHEEL_SEGMENTS = [300, 500, 1000, 3000];

export class SpinResult {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly points: number,
    public readonly createdAt: Date,
  ) {}
}
