import { sanitizeUrl } from "@braintree/sanitize-url";
import Cookies from "js-cookie";

export const sanitize = (input: string): string => {
  return sanitizeUrl(input);
};

export const getRawRedirectUrl = (): string | null => {
  const redirectUrl = Cookies.get("redirectUrl");
  if (redirectUrl) {
    Cookies.remove("redirectUrl", { path: "/" });
    return redirectUrl;
  }
  return null;
};

/**
 * Combines sanitization and retrieval of the redirect URL from cookies.
 * @returns The sanitized and validated redirect URL from the cookie, or `null` if invalid or absent.
 */
export const getRedirectUrl = (): string | null => {
  const rawRedirectUrl = getRawRedirectUrl();
  if (!rawRedirectUrl) {
    return null;
  }
  return sanitize(rawRedirectUrl);
};
