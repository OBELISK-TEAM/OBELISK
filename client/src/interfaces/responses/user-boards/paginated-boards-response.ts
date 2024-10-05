import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";

export interface PaginatedBoardsResponse {
  data: BoardResponse[];
  page: number;
  limit: number;
  total: number;
}
