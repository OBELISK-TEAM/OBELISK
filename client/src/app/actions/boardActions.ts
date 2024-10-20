"use server";

import { getCookie } from "@/lib/authApiUtils";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import logger from "@/lib/logger";

export async function createBoard(name: string): Promise<BoardDataResponse> {
  const token = getCookie("accessToken");
  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }
    return await response.json();
  } catch (error) {
    logger.error("Error while creating board:", error);
    throw error;
  }
}

export const deleteBoard = async (boardId: string) => {
  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    throw new Error("Access token is required");
  }
  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }
  } catch (error) {
    logger.error("Error while deleting board:", error);
    throw error;
  }
};
