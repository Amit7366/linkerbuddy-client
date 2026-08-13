import { notFound } from "next/navigation";
import { BlogArticleContent } from "@/components/marketing/blog-article-content";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPosts, getBlogPost } from "@/content/blog/posts";
import { getDictionary } from "@/i18n";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const locale = await getRequestLocale();
  const dict = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    page: "blog",
    path: `/blog/${slug}`,
    title: dict.blogArticle.title,
    description: dict.blogArticle.subtitle,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const locale = await getRequestLocale();

  if (!post) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: dict.blogArticle.title,
          description: dict.blogArticle.subtitle,
          slug,
          datePublished: post.date,
          locale,
        })}
      />
      <BlogArticleContent date={post.date} readingMinutes={post.readingMinutes} />
    </>
  );
}
