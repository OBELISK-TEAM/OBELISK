"use server";

import { getCookie } from "@/utils/authApi";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";
import { SlideIdResponse } from "@/interfaces/responses/slide-id-response";
import { revalidatePath } from "next/cache";

export async function createCanvasObject(slideId: string, objectData: any): Promise<any> {
  const accessToken = getCookie("accessToken");
  //console.log("token", accessToken);
  const { erasable, ...objectWithoutErasable } = objectData;
  console.log("erasable", erasable); // i want to use it otherwise i will receive an error
  const body = JSON.stringify({ slideId, ...objectWithoutErasable });
  try {
    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slide-objects`, {
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
    console.error("Error while creating object:", error);
    throw error;
  }
}

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
