"use server";

import { getCookie } from "@/lib/authApiUtils";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import logger from "@/lib/logger";
import { GrantPermissionResponse } from "@/interfaces/responses/board-permission/grant-permission-response";
import { BoardPermission } from "@/enums/BoardPermission";
import { boardPermissionToNum } from "@/lib/boardPermissionConverter";
import { VerifyPermissionResponse } from "@/interfaces/responses/board-permission/verify-permission-response";

export async function generatePermissionCode(
  boardId: string,
  grantPermission: BoardPermission
): Promise<GrantPermissionResponse> {
  const permission = boardPermissionToNum(grantPermission);
  const token = getCookie("accessToken");
  logger.log(`Granting permission ${permission} to board ${boardId}`);
  try {
    const response = await fetch(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}/permissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permission,
        }),
      }
    );

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }
    return await response.json();
  } catch (error) {
    logger.error("Error while granting permission:", error);
    throw error;
  }
}

export async function grantPermission(code: string): Promise<VerifyPermissionResponse> {
  const token = getCookie("accessToken");
  try {
    const response = await fetch(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/permissions/${code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }
    return await response.json();
  } catch (error) {
    logger.error("Error while granting permission:", error);
    throw error;
  }
}
