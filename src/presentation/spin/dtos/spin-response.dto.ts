import type { SpinResult } from '@domain/entities/spin-result.entity';

export class SpinResponseDto {
  id: string;
  player_id: string;
  points: number;
  created_at: Date;

  static fromEntity(spinResult: SpinResult): SpinResponseDto {
    const dto = new SpinResponseDto();
    dto.id = spinResult.id;
    dto.player_id = spinResult.playerId;
    dto.points = spinResult.points;
    dto.created_at = spinResult.createdAt;
    return dto;
  }
}
