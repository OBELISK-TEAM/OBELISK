import "server-only";
import { getCookie } from "@/lib/authApiUtils";
import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";

export async function getUniqueVisitors(boardId: string): Promise<number> {
  const accessToken = getCookie("accessToken");
  try {
    const response = await apiRequest(`/stats/board/${boardId}/unique-visitors`, {
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
