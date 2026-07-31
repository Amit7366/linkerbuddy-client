import { headers } from "next/headers";
import { cookies } from "next/headers";
import { resolveLocale } from "@/i18n";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { LOCALE_HEADER } from "@/i18n/routing";

/** Locale for the current request (middleware header wins, then cookie). */
export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (fromHeader) return resolveLocale(fromHeader);

  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
