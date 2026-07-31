import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from "@/i18n/config";
import {
  LOCALE_HEADER,
  resolvePreferredLocale,
  shouldLocalizePath,
  stripLocalePrefix,
  withLocalePrefix,
} from "@/i18n/routing";

const protectedAccountPaths = ["/account"];
const protectedCrmPaths = ["/crm"];
const protectedDashboardPaths = ["/dashboard"];

function withLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAccountRoute = protectedAccountPaths.some((p) => pathname.startsWith(p));
  const isCrmRoute = protectedCrmPaths.some((p) => pathname.startsWith(p));
  const isDashboardRoute = protectedDashboardPaths.some((p) =>
    pathname.startsWith(p),
  );

  if (isAccountRoute || isCrmRoute || isDashboardRoute) {
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (!shouldLocalizePath(pathname)) {
    return NextResponse.next();
  }

  const { locale: pathLocale, pathname: barePath } = stripLocalePrefix(pathname);
  const preferred = resolvePreferredLocale(
    request.cookies.get(LOCALE_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  // `/en/inventory` → rewrite internally to `/inventory` and expose locale
  if (pathLocale) {
    const url = request.nextUrl.clone();
    url.pathname = barePath;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, pathLocale);

    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    return withLocaleCookie(response, pathLocale);
  }

  // Bare marketing URL → canonical locale-prefixed URL
  const locale = preferred || defaultLocale;
  if (!isLocale(locale)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = withLocalePrefix(pathname, locale);
  const response = NextResponse.redirect(redirectUrl);
  return withLocaleCookie(response, locale);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
