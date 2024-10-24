import { ApiErrorResponse } from "@/interfaces/responses/api-error-response";

export const extractMessagesFromApiError = async (response: Response): Promise<string[]> => {
  const errorData: ApiErrorResponse = await response.json();
  let errorMessages: string[] = [];

  if (errorData?.details && typeof errorData.details === "object") {
    const details = errorData.details as { message: string[] };

    if (Array.isArray(details.message)) {
      errorMessages = details.message;
    } else if (errorData.message) {
      errorMessages.push(errorData.message);
    }
  } else if (errorData.message) {
    errorMessages.push(errorData.message);
  }

  if (errorMessages.length === 0) {
    errorMessages.push("Something went wrong");
  }

  return errorMessages;
};
