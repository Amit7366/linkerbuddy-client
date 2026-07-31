import { Container } from "@/components/layout/container";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "about", path: "/about" });
}

export default function AboutPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-bold">About us</h1>
      <p className="mt-6 max-w-2xl text-lg text-zinc-600">
        We help businesses launch with a professional landing page and scale to
        e-commerce and CRM — all on a unified, secure platform.
      </p>
    </Container>
  );
}
