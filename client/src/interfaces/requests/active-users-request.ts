export interface ActiveUsersRequest {
  boardId: string;
  startDate: Date;
  endDate: Date;
  aggregationIntervalMinutes: number;
}
