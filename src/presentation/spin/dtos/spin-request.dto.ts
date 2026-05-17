import { IsIn } from 'class-validator';

import { WHEEL_SEGMENTS } from '@domain/constants/game.constants';

export class SpinRequestDto {
  @IsIn(WHEEL_SEGMENTS)
  points: number;
}
