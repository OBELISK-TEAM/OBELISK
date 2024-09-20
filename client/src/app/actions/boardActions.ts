"use server";

import { getCookie } from "@/utils/authApi";
import { BoardDataResponse } from "@/interfaces/board-data-response";
import { ApiError } from "@/interfaces/api-error";

export async function createBoard(): Promise<BoardDataResponse> {
  const token = getCookie("accessToken");
  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: `Board-${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || "Failed to create board");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
}
