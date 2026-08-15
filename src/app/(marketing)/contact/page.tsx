import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "contact", path: "/contact" });
}

export default function ContactPage() {
  return <ContactPageContent />;
}
