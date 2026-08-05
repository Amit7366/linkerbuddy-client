import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import {
  REFRESH_COOKIE_NAME,
  clearRefreshCookie,
  extractRefreshTokenFromUpstream,
  setRefreshCookie,
} from "@/lib/auth/refresh-cookie";

type ProxyAuthOptions = {
  path: string;
  method?: "POST" | "GET";
  request?: NextRequest;
  body?: unknown;
  /** When true, clear the app-domain cookie even if upstream does not return one. */
  clearCookie?: boolean;
};

type AuthPayload = {
  user?: unknown;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
};

type UpstreamBody = {
  success?: boolean;
  data?: AuthPayload;
  error?: { code?: string; message?: string };
};

/**
 * Proxies auth to the API and mirrors the refresh cookie onto the Next.js host
 * so middleware on Vercel can see it (cross-origin API cookies never reach the app domain).
 */
export async function proxyAuth({
  path,
  method = "POST",
  request,
  body,
  clearCookie = false,
}: ProxyAuthOptions): Promise<NextResponse> {
  const existing = request?.cookies.get(REFRESH_COOKIE_NAME)?.value;

  // Avoid noisy upstream 401s when there is nothing to refresh
  if (path === "/auth/refresh" && !existing) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Refresh token required" },
      },
      { status: 401 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Prefer JSON body for refresh — Cookie header forwarding is brittle across runtimes
  let upstreamBody = body;
  if (path === "/auth/refresh" && existing) {
    upstreamBody = { refreshToken: existing };
  } else if (existing) {
    headers.Cookie = `${REFRESH_COOKIE_NAME}=${existing}`;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      method,
      headers,
      body: upstreamBody === undefined ? undefined : JSON.stringify(upstreamBody),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPSTREAM_ERROR", message: "Auth service unavailable" },
      },
      { status: 503 },
    );
  }

  const data = (await upstream.json().catch(() => ({
    success: false,
    error: { code: "UPSTREAM_ERROR", message: "Auth service unavailable" },
  }))) as UpstreamBody;

  const tokenFromBody = data.data?.refreshToken;
  if (data.data && "refreshToken" in data.data) {
    const { refreshToken: _omit, ...safeData } = data.data;
    data.data = safeData;
  }

  const response = NextResponse.json(data, { status: upstream.status });

  if (clearCookie) {
    clearRefreshCookie(response);
  }

  // Invalid/expired refresh — drop the app cookie so middleware/login stop looping
  if (path === "/auth/refresh" && upstream.status === 401 && existing) {
    clearRefreshCookie(response);
  }

  const token = tokenFromBody ?? extractRefreshTokenFromUpstream(upstream) ?? null;
  if (token) {
    setRefreshCookie(response, token);
  }

  return response;
}
