import { ApiErrorI } from "@/interfaces/api-error";

export const handleApiError = async (response: Response): Promise<never> => {
  const errorData: ApiErrorI = await response.json();
  //console.log("errorData", errorData);
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
  console.log("errorMessages", errorMessages);

  throw new Error(JSON.stringify(errorMessages));
};
