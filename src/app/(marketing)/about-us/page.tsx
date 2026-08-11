import { redirect } from "next/navigation";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocalePrefix } from "@/i18n/routing";

/** Alias for /about — keeps guideline URL /about-us working. */
export default async function AboutUsAliasPage() {
  const locale = await getRequestLocale();
  redirect(withLocalePrefix("/about", locale));
}
