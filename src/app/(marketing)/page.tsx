import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Home",
  description: "SEO-optimized landing platform that scales to e-commerce and CRM.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Hero />
      <Features />
    </>
  );
}
