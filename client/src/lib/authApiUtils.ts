import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";
import { jwtDecode } from "jwt-decode";

export const setTokenCookie = (token: string) => {
  const decoded: any = jwt.decode(token);
  const expiryDate = new Date(decoded.exp * 1000);
  cookies().set("accessToken", token, {
    expires: expiryDate,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export async function clearCookie() {
  const cookieStore = cookies();
  cookieStore.set("accessToken", "", {
    expires: new Date(0),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export const getCookie = (cookieName: string): string | undefined => {
  const cookieStore = cookies();
  return cookieStore.get(cookieName)?.value;
};

export const decodeToken = (token?: string): DecodedToken | null => {
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};
