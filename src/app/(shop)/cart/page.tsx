import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Cart", noIndex: true });

export default function CartPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-bold">Cart</h1>
      <p className="mt-4 text-zinc-600">Shopping cart — Phase 2.</p>
    </Container>
  );
}
