import { Body, Controller, Post } from '@nestjs/common';

import { LoginPlayerDto } from '@presentation/player/dtos/login-player.dto';
import { PlayerResponseDto } from '@presentation/player/dtos/player-response.dto';

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
    const playerWithRewards = await this.getPlayer.execute({ id: player.id });
    return PlayerResponseDto.fromEntity(playerWithRewards);
  }
}
