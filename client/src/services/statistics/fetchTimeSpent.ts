import "server-only";
import { getCookie } from "@/lib/authApiUtils";
import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";
import { TimeSpentResponse } from "@/interfaces/responses/statistics/time-spent-response";

export async function getTimeSpent(boardId: string): Promise<TimeSpentResponse[]> {
  const accessToken = getCookie("accessToken");
  try {
    const response = await apiRequest(`/stats/board/${boardId}/times-spent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    logger.error("Error while fetching unique visitors:", error);
    throw error;
  }
}
