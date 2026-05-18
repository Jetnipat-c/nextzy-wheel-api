import { Inject, Injectable } from '@nestjs/common';

import { Player } from '@domain/entities/player.entity';
import { PLAYER_REPOSITORY } from '@domain/repositories/player.repository';
import type { PlayerRepository } from '@domain/repositories/player.repository';

export interface LoginPlayerInput {
  username: string;
}

@Injectable()
export class LoginPlayerUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(input: LoginPlayerInput): Promise<Player> {
    const existing = await this.playerRepository.findByUsername(input.username);
    if (existing) return existing;

    const player = new Player(
      crypto.randomUUID(),
      input.username,
      0,
      new Date(),
    );

    return this.playerRepository.save(player);
  }
}
