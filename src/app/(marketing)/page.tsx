import dynamic from "next/dynamic";
import { Hero } from "@/components/marketing/hero";
import { ShortlistBar } from "@/components/marketing/shortlist-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeSkeleton } from "@/components/ui/skeleton";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

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

export const metadata = buildMetadata({
  title: "India Guest Post Sites",
  description:
    "Browse verified Indian guest post and link insertion placements with transparent pricing and fast turnaround.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <a
        href="#marketplace"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to marketplace
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
