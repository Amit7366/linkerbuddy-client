import { BlogIndexContent } from "@/components/marketing/blog-index-content";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "blog", path: "/blog" });
}

export default function BlogPage() {
  return <BlogIndexContent />;
}
