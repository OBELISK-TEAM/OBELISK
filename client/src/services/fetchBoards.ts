import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import logger from "@/lib/logger";

export const fetchBoards =
  (accessToken: string) =>
  async (url: string): Promise<PaginatedBoardsResponse> => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const reasons = await extractMessagesFromApiError(response);
        throw new ApiError(reasons);
      }

      const jsonData: PaginatedBoardsResponse = await response.json();

      const boards = jsonData.boards.map((board: BoardResponse): BoardResponse => {
        return {
          ...board,
          size: board.size ?? 100,
        };
      });

      return {
        ...jsonData,
        boards,
      };
    } catch (error) {
      logger.error("Error while fetching boards:", error);
      throw error;
    }
  };
