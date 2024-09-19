"use server";

import { cookies } from "next/headers";
import { ApiError } from "@/interfaces/api-error";

export async function createCanvasObject(slideId: string, objectData: any): Promise<any> {
  const accessToken = cookies().get("accessToken")?.value;
  //console.log("token", accessToken);
  const { erasable, ...objectWithoutErasable } = objectData;

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
      const errorData: ApiError = await response.json();
      throw new Error(errorData.message || "Failed to create object");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating object:", error);
    throw error;
  }
}

export async function updateCanvasObject(backendId: string, objectData: any) {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slide-objects/${backendId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(objectData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update object on the backend");
  }

  return response.json();
}

export async function deleteCanvasObject(backendId: string) {
  const token = cookies().get("token")?.value;

  const response = await fetch(
    `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slide-objects/${backendId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete object on the backend");
  }

  return response.json();
}
