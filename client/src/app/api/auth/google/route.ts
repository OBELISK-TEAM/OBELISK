import { NextRequest, NextResponse } from "next/server";
import { setTokenCookie } from "@/lib/authApiUtils";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { state } = await req.json();

    // console.log(
    //   "endpoint",
    //   `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/google/login`,
    // );
    // console.log("method", "POST");
    // console.log("headers", {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${state}`,
    // });

    const response = await fetch(`http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/auth/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state}`,
      },
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      //console.log("accessToken", accessToken);
      setTokenCookie(accessToken);
      return NextResponse.json({ message: "Login successful" });
    } else {
      logger.error("Promise resolved but HTTP status failed");
      const error = await response.json();
      return NextResponse.json(error, {
        status: response.status,
      } as ResponseInit);
    }
  } catch (error) {
    logger.error("Promise rejected", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
