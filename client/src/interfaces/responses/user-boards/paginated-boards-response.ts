import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";

export interface BoardsResponse {
  data: BoardResponse[];
  currentPage: number;
  perPage: number;
  total: number;
}
