import { Body, Controller, Post } from '@nestjs/common';

import { LoginPlayerUseCase } from '@application/use-cases/player/login-player.use-case';

import { LoginPlayerDto } from '@presentation/player/dtos/player/login-player.dto';

@Controller({ path: 'players', version: '1' })
export class PlayerController {
  constructor(private readonly loginPlayer: LoginPlayerUseCase) {}

  @Post('login')
  login(@Body() dto: LoginPlayerDto) {
    return this.loginPlayer.execute({ username: dto.username });
  }
}
