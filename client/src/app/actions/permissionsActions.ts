"use server";

import { getCookie } from "@/lib/authApiUtils";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import logger from "@/lib/logger";
import { GeneratePermissionCodeResponse } from "@/interfaces/responses/board-permission/generate-permission-code-response";
import { BoardPermission } from "@/enums/BoardPermission";
import { boardPermissionToNum } from "@/lib/boardPermissionConverter";
import { GrantPermissionResponse } from "@/interfaces/responses/board-permission/grant-permission-response";

export async function generatePermissionCode(
  boardId: string,
  grantPermission: BoardPermission
): Promise<GeneratePermissionCodeResponse> {
  const permission = boardPermissionToNum(grantPermission);
  const token = getCookie("accessToken");
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
    logger.error("Error while generating permission code:", error);
    throw error;
  }
}

export async function grantPermission(code: string): Promise<GrantPermissionResponse> {
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
