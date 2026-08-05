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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const existing = request?.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (existing) {
    headers.Cookie = `${REFRESH_COOKIE_NAME}=${existing}`;
  }

  const upstream = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await upstream.json().catch(() => ({
    success: false,
    error: { code: "UPSTREAM_ERROR", message: "Auth service unavailable" },
  }))) as UpstreamBody;

  // Never expose refreshToken to the browser — only set it as httpOnly cookie
  const tokenFromBody = data.data?.refreshToken;
  if (data.data && "refreshToken" in data.data) {
    const { refreshToken: _omit, ...safeData } = data.data;
    data.data = safeData;
  }

  const response = NextResponse.json(data, { status: upstream.status });

  if (clearCookie || upstream.status === 401) {
    clearRefreshCookie(response);
  }

  const token = extractRefreshTokenFromUpstream(upstream) ?? tokenFromBody ?? null;
  if (token) {
    setRefreshCookie(response, token);
  } else if (clearCookie) {
    clearRefreshCookie(response);
  }

  return response;
}
