import { Player } from '@domain/entities/player.entity';

export const PLAYER_REPOSITORY = Symbol('PLAYER_REPOSITORY');

export interface PlayerRepository {
  findById(id: string): Promise<Player | null>;
  findByUsername(username: string): Promise<Player | null>;
  save(player: Player, tx?: unknown): Promise<Player>;
}
