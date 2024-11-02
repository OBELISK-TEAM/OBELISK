"use server";

import { getCookie } from "@/lib/authApiUtils";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";
import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";
import { revalidatePath } from "next/cache";

export async function createBoard(name: string): Promise<BoardDataResponse> {
  const token = getCookie("accessToken");
  try {
    const response = await apiRequest(`/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    revalidatePath("/user-boards");
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
    await apiRequest(`/boards/${boardId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    logger.error("Error while deleting board:", error);
    throw error;
  }
};
