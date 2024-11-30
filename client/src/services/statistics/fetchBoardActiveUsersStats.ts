import "server-only";

import { getCookie } from "@/lib/authApiUtils";

import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";
import { ActiveUsersRequest } from "@/interfaces/requests/active-users-request";
import { ActiveUsersResponse } from "@/interfaces/responses/statistics/active-users-response";

export async function getActiveUsers(request: ActiveUsersRequest): Promise<ActiveUsersResponse[]> {
  const { boardId, startDate, endDate, aggregationIntervalMinutes } = request;
  const accessToken = getCookie("accessToken");
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      aggregationIntervalMinutes: aggregationIntervalMinutes.toString(),
    });
    const response = await apiRequest(`/stats/board/${boardId}/active-users-over-time?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    logger.error("Error while fetching active users over time:", error);
    throw error;
  }
}
