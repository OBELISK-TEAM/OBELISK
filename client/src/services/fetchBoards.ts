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

      return await response.json();
    } catch (error) {
      logger.error("Error while fetching boards:", error);
      throw error;
    }
  };
