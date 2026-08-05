import type { NextResponse } from "next/server";

export const REFRESH_COOKIE_NAME = "refreshToken";
/** Readable marker so the client can skip anonymous refresh calls (httpOnly token is invisible to JS). */
export const SESSION_HINT_COOKIE = "lb_has_session";
export const REFRESH_COOKIE_MAX_AGE = 2 * 60 * 60; // 2 hours (seconds)

export function refreshCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  };
}

function hintCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: false,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  };
}

export function setRefreshCookie(response: NextResponse, token: string) {
  response.cookies.set(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
  response.cookies.set(SESSION_HINT_COOKIE, "1", hintCookieOptions());
}

export function clearRefreshCookie(response: NextResponse) {
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...refreshCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(SESSION_HINT_COOKIE, "", {
    ...hintCookieOptions(),
    maxAge: 0,
  });
}

/** Client-only: true when a session cookie is likely present. */
export function hasSessionHint(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((part) => part.startsWith(`${SESSION_HINT_COOKIE}=`));
}

/** Read refreshToken from an upstream API Set-Cookie header. */
export function extractRefreshTokenFromUpstream(response: Response): string | null {
  const headers =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  for (const header of headers) {
    if (!header.toLowerCase().startsWith(`${REFRESH_COOKIE_NAME.toLowerCase()}=`)) {
      continue;
    }
    const raw = header.slice(REFRESH_COOKIE_NAME.length + 1).split(";")[0]?.trim();
    if (!raw || raw === "deleted" || raw === "") return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  const folded = response.headers.get("set-cookie");
  if (!folded) return null;
  const match = folded.match(
    new RegExp(`(?:^|,\\s*)${REFRESH_COOKIE_NAME}=([^;,]*)`, "i"),
  );
  const raw = match?.[1]?.trim();
  if (!raw || raw === "deleted") return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
