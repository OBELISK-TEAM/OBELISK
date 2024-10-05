import { NextResponse } from "next/server";
import { clearCookie } from "@/lib/authApiUtils";

export async function POST() {
  await clearCookie();
  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
