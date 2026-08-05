import { NextResponse, type NextRequest } from "next/server";
import { proxyAuth } from "@/lib/auth/proxy-auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid JSON body" },
      },
      { status: 400 },
    );
  }

  return proxyAuth({
    path: "/auth/login",
    request,
    body,
  });
}
