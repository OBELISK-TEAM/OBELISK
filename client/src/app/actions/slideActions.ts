"use server";

import { getCookie } from "@/lib/authApiUtils";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import { SlideIdResponse } from "@/interfaces/responses/slide-id-response";
import { revalidatePath } from "next/cache";

// TODO: remove
export async function createSlide(boardId: string): Promise<SlideIdResponse> {
  const accessToken = getCookie("accessToken");

  const body = JSON.stringify({
    version: "5.3.0",
    boardId,
  });

  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }
    return await response.json();
  } catch (error) {
    console.error("Error while creating slide:", error);
    throw error;
  }
}

// TODO: remove
export async function deleteSlide(slideId: string): Promise<SlideIdResponse> {
  const accessToken = getCookie("accessToken");

  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slides/${slideId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const reasons = await extractMessagesFromApiError(response);
      throw new ApiError(reasons);
    }

    return await response.json();
  } catch (error) {
    console.error("Error while deleting slide:", error);
    throw error;
  }
}

export async function revalidateSlidePath(boardId: string, slideIndex: number) {
  revalidatePath(`/user-boards/${boardId}/slides/${slideIndex}`);
}
