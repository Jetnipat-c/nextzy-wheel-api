import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LoginPlayerDto } from '@presentation/player/dtos/login-player.dto';
import { LoginResponseDto } from '@presentation/player/dtos/login-response.dto';
import { PlayerProfileResponseDto } from '@presentation/player/dtos/player-profile-response.dto';

import { GetPlayerUseCase } from '@application/use-cases/player/get-player.use-case';
import { LoginPlayerUseCase } from '@application/use-cases/player/login-player.use-case';

@Controller({ path: 'players', version: '1' })
export class PlayerController {
  constructor(
    private readonly loginPlayer: LoginPlayerUseCase,
    private readonly getPlayer: GetPlayerUseCase,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginPlayerDto) {
    const player = await this.loginPlayer.execute({ username: dto.username });
    return LoginResponseDto.fromEntity(player);
  }

  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    const player = await this.getPlayer.execute({ id });
    return PlayerProfileResponseDto.fromEntity(player);
  }
}
