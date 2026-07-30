import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Products",
  description: "Browse our product catalog.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-bold">Products</h1>
      <p className="mt-4 text-zinc-600">Product catalog coming in Phase 2.</p>
    </Container>
  );
}
