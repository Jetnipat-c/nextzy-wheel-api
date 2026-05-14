import type { Player } from '@domain/entities/player.entity';

export class PlayerResponseDto {
  id: string;
  username: string;
  total_points: number;
  created_at: Date;

  static fromEntity(player: Player): PlayerResponseDto {
    const dto = new PlayerResponseDto();
    dto.id = player.id;
    dto.username = player.username;
    dto.total_points = player.totalPoints;
    dto.created_at = player.createdAt;
    return dto;
  }
}
