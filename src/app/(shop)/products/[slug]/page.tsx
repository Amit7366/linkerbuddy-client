import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  return buildMetadata({
    title: slug,
    description: `Product: ${slug}`,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  return (
    <Container className="py-20">
      <h1 className="text-4xl font-bold capitalize">{slug.replace(/-/g, " ")}</h1>
      <p className="mt-4 text-zinc-600">Product detail page — Phase 2.</p>
    </Container>
  );
}
