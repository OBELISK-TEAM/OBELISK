import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const setTokenCookie = (token: string) => {
  const decoded: any = jwt.decode(token);
  const expiryDate = new Date(decoded.exp * 1000);
  cookies().set("accessToken", token, {
    expires: expiryDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export async function clearCookie() {
  const cookieStore = cookies();
  cookieStore.set("accessToken", "", { maxAge: 0, path: "/" });
}
