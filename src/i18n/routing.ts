import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  locales,
  type Locale,
} from "@/i18n/config";

export const LOCALE_HEADER = "x-locale";

/** Marketing paths that should be indexable per locale. */
export const localizedMarketingPrefixes = [
  "/",
  "/inventory",
  "/about",
  "/pricing",
  "/blog",
  "/contact",
] as const;

const EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/crm",
  "/account",
  "/products",
  "/cart",
  "/checkout",
  "/categories",
  "/brand",
  "/og",
] as const;

export function shouldLocalizePath(pathname: string): boolean {
  if (EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return false;
  }
  // Static assets
  if (/\.[a-z0-9]+$/i.test(pathname)) return false;
  return true;
}

export function stripLocalePrefix(pathname: string): {
  locale: Locale | null;
  pathname: string;
} {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (isLocale(maybeLocale)) {
    const rest = `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
    return { locale: maybeLocale, pathname: rest };
  }
  return { locale: null, pathname: pathname || "/" };
}

export function withLocalePrefix(pathname: string, locale: Locale): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const { pathname: bare } = stripLocalePrefix(pathname);
  return withLocalePrefix(bare, nextLocale);
}

export function resolvePreferredLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (isLocale(cookieValue)) return cookieValue;

  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(",")
      .map((part) => part.trim().split(";")[0]?.toLowerCase())
      .filter(Boolean);

    for (const candidate of candidates) {
      if (isLocale(candidate)) return candidate;
      const base = candidate.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function hreflangLanguages(pathWithoutLocale: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = withLocalePrefix(pathWithoutLocale, locale);
  }
  languages["x-default"] = withLocalePrefix(pathWithoutLocale, defaultLocale);
  return languages;
}

export { LOCALE_COOKIE, defaultLocale, locales };
