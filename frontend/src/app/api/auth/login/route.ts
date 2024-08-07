import { NextRequest, NextResponse } from "next/server";
import { setTokenCookie } from "@/lib/authApi";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const response = await fetch(
    `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (response.ok) {
    const { accessToken } = await response.json();
    const res = NextResponse.json({ message: "Login successful" });
    setTokenCookie(accessToken);
    return res;
  } else {
    const error = await response.json();
    return NextResponse.json(error, { status: response.status });
  }
}
