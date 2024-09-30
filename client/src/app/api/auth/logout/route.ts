import { NextResponse } from "next/server";
import { clearCookie } from "@/lib/authApi";

export async function POST() {
  await clearCookie();
  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
