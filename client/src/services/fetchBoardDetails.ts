import "server-only";

import { getCookie } from "@/lib/authApiUtils";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import logger from "@/lib/logger";

export async function getBoardDetailsData(boardId: string): Promise<BoardDetailsResponse> {
  const accessToken = getCookie("accessToken");
  if (!accessToken) {
    throw new Error("User not authenticated.");
  }
  try {
    const response = await fetch(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}/details`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }

    return await response.json();
  } catch (error) {
    logger.error("Error while fetching board details:", error);
    throw error;
  }
}
