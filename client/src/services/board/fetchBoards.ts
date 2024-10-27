import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";

export const fetchBoards =
  (accessToken: string) =>
  async (url: string): Promise<PaginatedBoardsResponse> => {
    try {
      const response = await apiRequest(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      logger.error("Error while fetching boards:", error);
      throw error;
    }
  };
