import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "@/lib/authApiUtils";
import logger from "@/lib/logger";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return false;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return false;
  }
  return Boolean(decoded.exp && decoded.exp * 1000 > Date.now());
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isAuthenticated(request)) {
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/user-boards", request.url));
    }
  } else {
    if (pathname.startsWith("/user-boards") && !pathname.startsWith("/auth")) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.set("redirectUrl", pathname + search, {
        path: "/",
        httpOnly: false, // Our cookie needs to be accessible client-side (from authContext)
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user-boards/:path*", "/auth/:path*"],
};
