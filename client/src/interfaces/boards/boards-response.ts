import { BoardResponse } from "@/interfaces/boards/board-response";

export interface BoardsResponse {
  data: BoardResponse[];
  currentPage: number;
  perPage: number;
  total: number;
}
