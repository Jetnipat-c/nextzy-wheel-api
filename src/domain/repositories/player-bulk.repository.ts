export const PLAYER_BULK_REPOSITORY = Symbol('PLAYER_BULK_REPOSITORY');

export interface PlayerBulkRepository {
  bulkUpsertUsernames(usernames: string[]): Promise<Map<string, string>>;
  recalculateTotalPoints(): Promise<void>;
}
