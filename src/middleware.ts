import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedAccountPaths = ["/account"];
const protectedCrmPaths = ["/crm"];
const protectedDashboardPaths = ["/dashboard"];

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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/crm/:path*", "/dashboard/:path*"],
};
