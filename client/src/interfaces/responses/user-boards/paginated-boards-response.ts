import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";

export interface PaginatedBoardsResponse {
  boards: BoardResponse[];
  page: number;
  limit: number;
  order?: string;
  total: number;
}
