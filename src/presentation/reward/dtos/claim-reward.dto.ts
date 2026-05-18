import { IsInt, IsIn } from 'class-validator';

export class ClaimRewardDto {
  @IsInt()
  @IsIn([500, 1000, 10000])
  points: number;
}
