import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const marketingPaths = ["/", "/about", "/pricing", "/blog", "/contact", "/inventory"];
  const blogSlugs = blogPosts.map((post) => post.slug);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of marketingPaths) {
      const localizedPath = withLocalePrefix(path, locale);
      entries.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((code) => [
              code,
              `${baseUrl}${withLocalePrefix(path, code)}`,
            ]),
            ["x-default", `${baseUrl}${withLocalePrefix(path, "en")}`],
          ]),
        },
      });
    }

    for (const slug of blogSlugs) {
      const path = `/blog/${slug}`;
      entries.push({
        url: `${baseUrl}${withLocalePrefix(path, locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((code) => [
              code,
              `${baseUrl}${withLocalePrefix(path, code)}`,
            ]),
            ["x-default", `${baseUrl}${withLocalePrefix(path, "en")}`],
          ]),
        },
      });
    }
  }

  return entries;
}
