import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE_NAME } from "@/lib/auth/refresh-cookie";

/** Lightweight cookie probe for the client (no upstream call). */
export async function GET(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(REFRESH_COOKIE_NAME)?.value);
  return NextResponse.json({ hasSession });
}
