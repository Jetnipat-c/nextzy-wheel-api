import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ClaimRewardUseCase } from '@application/use-cases/reward/claim-reward.use-case';
import { GetMyRewardsUseCase } from '@application/use-cases/reward/get-my-rewards.use-case';

import { ClaimRewardDto } from '@presentation/reward/dtos/claim-reward.dto';
import { RewardResponseDto } from '@presentation/reward/dtos/reward-response.dto';

@Controller({ path: 'players', version: '1' })
export class RewardController {
  constructor(
    private readonly claimReward: ClaimRewardUseCase,
    private readonly getMyRewards: GetMyRewardsUseCase,
  ) {}

  @Post(':playerId/rewards/claim')
  async claim(
    @Param('playerId') playerId: string,
    @Body() dto: ClaimRewardDto,
  ) {
    const reward = await this.claimReward.execute({
      playerId,
      points: dto.points,
    });
    return RewardResponseDto.fromEntity(reward);
  }

  @Get(':playerId/rewards')
  async myRewards(@Param('playerId') playerId: string) {
    const rewards = await this.getMyRewards.execute({ playerId });
    return rewards.map((reward) => RewardResponseDto.fromEntity(reward));
  }
}
