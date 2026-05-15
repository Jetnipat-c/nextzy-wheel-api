import { Controller, Get, Param, Post, Query } from '@nestjs/common';

import { RecordSpinUseCase } from '@application/use-cases/spin/spin-wheel.use-case';

import { SpinResponseDto } from '@presentation/spin/dtos/spin-response.dto';

@Controller({ path: 'players', version: '1' })
export class SpinController {
  constructor(private readonly spinWheel: RecordSpinUseCase) {}

  @Post(':playerId/spin')
  async spin(@Param('playerId') playerId: string) {
    const spinResult = await this.spinWheel.execute({ playerId });
    return SpinResponseDto.fromEntity(spinResult);
  }

  @Get(':playerId/spin')
  async getPlayerSpins(
    @Param('playerId') playerId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    // get-player-spins.use-case (ยังไม่ได้สร้าง)
  }
}
