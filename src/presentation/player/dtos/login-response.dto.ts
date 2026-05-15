import type { Player } from '@domain/entities/player.entity';

export class LoginResponseDto {
  id: string;
  username: string;

  static fromEntity(player: Player): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.id = player.id;
    dto.username = player.username;
    return dto;
  }
}
