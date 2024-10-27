import { extractMessagesFromApiError } from "@/lib/toastsUtils";
import { ApiError } from "@/errors/ApiError";

const API_HOST = process.env.SERVER_HOST;
const API_PORT = process.env.SERVER_PORT;

if (!API_HOST || !API_PORT) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_SERVER_PORT i NEXT_PUBLIC_SOCKET_GW_PORT muszą być zdefiniowane"
  );
}

const baseUrl = `http://${API_HOST}:${API_PORT}`;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  checkResponseStatus = true
): Promise<Response> {
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, options);

  if (checkResponseStatus && !response.ok) {
    const reasons = await extractMessagesFromApiError(response);
    throw new ApiError(reasons);
  }

  return response;
}
