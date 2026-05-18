import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { RecordSpinUseCase } from '@application/use-cases/spin/spin-wheel.use-case';
import { GetMySpinsUseCase } from '@application/use-cases/spin/get-my-spins.use-case';

import { PaginationDto } from '@presentation/common/dtos/pagination.dto';
import { SpinRequestDto } from '@presentation/spin/dtos/spin-request.dto';
import { SpinResponseDto } from '@presentation/spin/dtos/spin-response.dto';

@Controller({ path: 'players', version: '1' })
export class SpinController {
  constructor(
    private readonly spinWheel: RecordSpinUseCase,
    private readonly getMySpins: GetMySpinsUseCase,
  ) {}

  @Post(':playerId/spins')
  async spin(
    @Param('playerId') playerId: string,
    @Body() body: SpinRequestDto,
  ) {
    const spinResult = await this.spinWheel.execute({
      playerId,
      points: body.points,
    });
    return SpinResponseDto.fromEntity(spinResult);
  }

  @Get(':playerId/spins')
  async mySpins(
    @Param('playerId') playerId: string,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.getMySpins.execute({ playerId, pagination });
    return {
      ...result,
      data: result.data.map((spin) => SpinResponseDto.fromEntity(spin)),
    };
  }
}
