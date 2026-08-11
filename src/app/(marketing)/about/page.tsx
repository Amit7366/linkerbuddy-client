import { AboutPageContent } from "@/components/marketing/about-page-content";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "about", path: "/about" });
}

export default function AboutPage() {
  return <AboutPageContent />;
}
