import { NextResponse } from "next/server";
import { clearCookie } from "@/utils/authApi";

export async function POST() {
  await clearCookie();
  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
