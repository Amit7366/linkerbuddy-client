import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Simple, transparent pricing for every stage of your business.",
  path: "/pricing",
});

const plans = [
  { name: "Starter", price: "$0", description: "Landing page + lead capture" },
  { name: "Growth", price: "$49", description: "E-commerce catalog + checkout" },
  { name: "Enterprise", price: "Custom", description: "Full CRM + analytics" },
];

export default function PricingPage() {
  return (
    <Container className="py-20">
      <h1 className="text-center text-4xl font-bold">Pricing</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-zinc-600">
        Start free. Upgrade as you grow through each phase.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-xl border border-zinc-200 p-8 text-center">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-4 text-3xl font-bold">{plan.price}</p>
            <p className="mt-2 text-sm text-zinc-600">{plan.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
