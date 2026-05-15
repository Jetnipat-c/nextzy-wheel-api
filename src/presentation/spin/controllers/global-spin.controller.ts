import { Controller, Get, Query } from '@nestjs/common';

import { PaginationDto } from '@presentation/common/dtos/pagination.dto';
import { SpinResponseDto } from '@presentation/spin/dtos/spin-response.dto';

import { GetGlobalSpinsUseCase } from '@application/use-cases/spin/get-global-spins.use-case';

@Controller({ path: 'spins', version: '1' })
export class GlobalSpinController {
  constructor(private readonly getGlobalSpins: GetGlobalSpinsUseCase) {}

  @Get()
  async globalSpins(@Query() pagination: PaginationDto) {
    const result = await this.getGlobalSpins.execute(pagination);
    return {
      ...result,
      data: result.data.map((spin) => SpinResponseDto.fromEntity(spin)),
    };
  }
}
