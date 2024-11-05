"use server";

import { getCookie } from "@/lib/authApiUtils";
import logger from "@/lib/logger";
import { GeneratePermissionCodeResponse } from "@/interfaces/responses/board-permission/generate-permission-code-response";
import { BoardPermission } from "@/enums/BoardPermission";
import { boardPermissionToNum } from "@/lib/permissionUtils";
import { GrantPermissionResponse } from "@/interfaces/responses/board-permission/grant-permission-response";
import { apiRequest } from "@/services/requestService";
import { BoardPermissionModifyRequest } from "@/interfaces/requests/board-permission-modify-request";

export async function generatePermissionCode(
  boardId: string,
  grantPermission: BoardPermission
): Promise<GeneratePermissionCodeResponse> {
  const permission = boardPermissionToNum(grantPermission);
  const token = getCookie("accessToken");
  logger.log("Generating permission code for board:", boardId);
  try {
    const response = await apiRequest(`/boards/${boardId}/permissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ permission }),
    });

    return await response.json();
  } catch (error) {
    logger.error("Error while generating permission code:", error);
    throw error;
  }
}

export async function grantPermission(code: string): Promise<GrantPermissionResponse> {
  const token = getCookie("accessToken");
  logger.log("Granting permission with code:", code);
  try {
    const response = await apiRequest(`/boards/permissions/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    logger.error("Error while granting permission:", error);
    throw error;
  }
}

export async function modifyPermission(
  boardId: string,
  boardPermissionModifyRequest: BoardPermissionModifyRequest
): Promise<void> {
  logger.log(`Modifying permission for user ${boardPermissionModifyRequest.userId} on board ${boardId}`);
  const token = getCookie("accessToken");
  try {
    await apiRequest(`/boards/${boardId}/permissions/modify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(boardPermissionModifyRequest),
    });
  } catch (error) {
    logger.error("Error while modifying permission:", error);
    throw error;
  }
}
