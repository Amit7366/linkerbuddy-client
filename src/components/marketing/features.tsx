import { Container } from "@/components/layout/container";

const features = [
  {
    title: "SEO-first marketing",
    description: "Built for search engines with metadata, sitemaps, and structured data.",
  },
  {
    title: "E-commerce ready",
    description: "Product catalog, cart, and checkout routes scaffolded for Phase 2.",
  },
  {
    title: "CRM built-in",
    description: "Lead capture today. Full sales pipeline and analytics in Phase 3.",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-center text-3xl font-bold text-zinc-900">Built for scale</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-zinc-200 p-6">
              <h3 className="text-lg font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
