import dynamic from "next/dynamic";
import { Hero } from "@/components/marketing/hero";
import { ShortlistBar } from "@/components/marketing/shortlist-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeSkeleton } from "@/components/ui/skeleton";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";
import { getDictionary } from "@/i18n";

const Marketplace = dynamic(
  () => import("@/components/marketing/marketplace").then((m) => m.Marketplace),
  { loading: () => <HomeSkeleton /> },
);

const Benefits = dynamic(
  () => import("@/components/marketing/benefits").then((m) => m.Benefits),
  {
    loading: () => (
      <section className="lb-section">
        <HomeSkeleton />
      </section>
    ),
  },
);

const Agency = dynamic(
  () => import("@/components/marketing/agency").then((m) => m.Agency),
  {
    loading: () => (
      <section className="lb-section bg-navy">
        <HomeSkeleton />
      </section>
    ),
  },
);

const ProcessSteps = dynamic(
  () => import("@/components/marketing/process-steps").then((m) => m.ProcessSteps),
  {
    loading: () => (
      <section className="lb-section">
        <HomeSkeleton />
      </section>
    ),
  },
);

const Pricing = dynamic(
  () => import("@/components/marketing/pricing").then((m) => m.Pricing),
  {
    loading: () => (
      <section className="lb-section">
        <HomeSkeleton />
      </section>
    ),
  },
);

const Faq = dynamic(
  () => import("@/components/marketing/faq").then((m) => m.Faq),
  {
    loading: () => (
      <section className="lb-section">
        <HomeSkeleton />
      </section>
    ),
  },
);

const CtaForm = dynamic(
  () => import("@/components/marketing/cta-form").then((m) => m.CtaForm),
  {
    loading: () => (
      <section className="py-[70px]">
        <HomeSkeleton />
      </section>
    ),
  },
);

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "home", path: "/" });
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          locale,
          description: dict.seo.pages.home.description,
        })}
      />
      <JsonLd
        data={websiteJsonLd({
          locale,
          description: dict.seo.pages.home.description,
        })}
      />
      <a
        href="#marketplace"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        {dict.common.skipToMarketplace}
      </a>
      <Hero />
      <Marketplace />
      <Benefits />
      <Agency />
      <ProcessSteps />
      <Pricing />
      <Faq />
      <CtaForm />
      <ShortlistBar />
    </>
  );
}
