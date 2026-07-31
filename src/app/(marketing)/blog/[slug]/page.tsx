import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

const posts: Record<string, { title: string; description: string; date: string; content: string }> = {
  "launch-your-landing-page": {
    title: "How to launch your landing page in a weekend",
    description: "A step-by-step guide to going live fast with SEO best practices.",
    date: "2026-07-01",
    content:
      "Start with a clear value proposition, optimize your metadata, and capture leads from day one.",
  },
  "scale-to-ecommerce": {
    title: "When to add e-commerce to your site",
    description: "Signs your business is ready for Phase 2 and how to prepare.",
    date: "2026-07-15",
    content:
      "Look for consistent traffic, product-market fit, and customer demand before enabling checkout.",
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  const locale = await getRequestLocale();

  return buildLocalizedMetadata({
    locale,
    page: "blog",
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];
  const locale = await getRequestLocale();

  if (!post) notFound();

  return (
    <Container className="py-20">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          slug,
          datePublished: post.date,
          locale,
        })}
      />
      <article className="prose prose-zinc max-w-3xl">
        <p className="text-sm text-zinc-500">{post.date}</p>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="mt-6 text-lg text-zinc-600">{post.content}</p>
      </article>
    </Container>
  );
}
