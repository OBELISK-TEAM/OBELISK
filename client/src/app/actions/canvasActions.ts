"use server";

import { cookies } from "next/headers";

export async function createCanvasObject(slideId: string, objectData: any) {
  const accessToken = cookies().get("accessToken")?.value;
  console.log("token", accessToken);
  console.log({ slideId, ...objectData });
  const body = JSON.stringify({ slideId, ...objectData });
  const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/slide-objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to create object on the backend");
  }

  return response.json();
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
