import { NextRequest, NextResponse } from "next/server";
import { setTokenCookie } from "@/lib/authApi";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    //console.log("body", JSON.stringify({ email, password }));

    const response = await fetch(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      const res = NextResponse.json({ message: "Signup successful" });
      setTokenCookie(accessToken);
      return res;
    } else {
      console.error("Promise resolved but HTTP status failed");
      const error = await response.json();
      return NextResponse.json(error, {
        status: response.status,
      } as ResponseInit);
    }
  } catch (error) {
    console.error("Promise rejected", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
