import type { NextRequest } from "next/server";
import { proxyAuth } from "@/lib/auth/proxy-auth";

export async function POST(request: NextRequest) {
  return proxyAuth({
    path: "/auth/logout",
    request,
    clearCookie: true,
  });
}
