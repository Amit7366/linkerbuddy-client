import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Insights on growing your business online.",
  path: "/blog",
});

const posts = [
  {
    slug: "launch-your-landing-page",
    title: "How to launch your landing page in a weekend",
    excerpt: "A step-by-step guide to going live fast with SEO best practices.",
    date: "2026-07-01",
  },
  {
    slug: "scale-to-ecommerce",
    title: "When to add e-commerce to your site",
    excerpt: "Signs your business is ready for Phase 2 and how to prepare.",
    date: "2026-07-15",
  },
];

export default function BlogPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-bold">Blog</h1>
      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-zinc-200 pb-8">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-2xl font-semibold group-hover:text-zinc-600">{post.title}</h2>
            </Link>
            <p className="mt-2 text-sm text-zinc-500">{post.date}</p>
            <p className="mt-2 text-zinc-600">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
