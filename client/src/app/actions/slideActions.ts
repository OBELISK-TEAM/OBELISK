"use server";

import { getCookie } from "@/utils/authApi";
import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiErrorData } from "@/errors/ApiErrorData";

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
      throw new ApiErrorData(reasons);
    }
    return await response.json();
  } catch (error) {
    console.error("Error while creating object:", error);
    throw error;
  }
}
