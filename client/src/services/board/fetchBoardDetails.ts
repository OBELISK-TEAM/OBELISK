import "server-only";

import { getCookie } from "@/lib/authApiUtils";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";

import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";

export async function getBoardDetailsData(boardId: string): Promise<BoardDetailsResponse> {
  const accessToken = getCookie("accessToken");
  if (!accessToken) {
    throw new Error("User not authenticated.");
  }
  try {
    const response = await apiRequest(`/boards/${boardId}/details`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    logger.error("Error while fetching board details:", error);
    throw error;
  }
}
