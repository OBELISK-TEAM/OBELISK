import { NextRequest, NextResponse } from "next/server";
import { setTokenCookie } from "@/lib/authApi";

export async function POST(req: NextRequest) {
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

  const response = await fetch(
    `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/google/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state}`,
      },
    },
  );

  if (response.ok) {
    const { accessToken } = await response.json();
    setTokenCookie(accessToken);
    return NextResponse.json({ message: "Login successful" });
  } else {
    const error = await response.json();
    return NextResponse.json(error, { status: response.status });
  }
}
