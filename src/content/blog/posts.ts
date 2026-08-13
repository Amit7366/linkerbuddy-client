export const NICHE_EDITS_SLUG = "niche-edits-vs-guest-posts";

export const blogPosts = [
  {
    slug: NICHE_EDITS_SLUG,
    date: "2026-08-14",
    readingMinutes: 6,
    featured: true,
  },
] as const;

export type BlogPostMeta = (typeof blogPosts)[number];
export type BlogPostSlug = BlogPostMeta["slug"];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPost(): BlogPostMeta {
  return blogPosts.find((post) => post.featured) ?? blogPosts[0];
}
