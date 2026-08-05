import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, defaultLocale } from "@/i18n/config";
import {
  resolvePreferredLocale,
  withLocalePrefix,
} from "@/i18n/routing";

export default async function CartPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const locale = resolvePreferredLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerStore.get("accept-language"),
  );

  redirect(withLocalePrefix("/checkout", locale || defaultLocale));
}
