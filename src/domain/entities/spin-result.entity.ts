export { WHEEL_SEGMENTS } from '@domain/constants/game.constants';

export class SpinResult {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly points: number,
    public readonly createdAt: Date,
  ) {}
}

export interface SpinResultWithUsername extends SpinResult {
  username: string;
}
