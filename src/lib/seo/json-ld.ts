import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/routing";

export function organizationJsonLd(options?: {
  locale?: Locale;
  description?: string;
}) {
  const locale = options?.locale ?? "en";
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.seo.siteName,
    url: `${siteConfig.url}${withLocalePrefix("/", locale)}`,
    description: options?.description ?? dict.seo.pages.home.description,
    inLanguage: locale,
  };
}

export function websiteJsonLd(options?: {
  locale?: Locale;
  description?: string;
}) {
  const locale = options?.locale ?? "en";
  const dict = getDictionary(locale);
  const url = `${siteConfig.url}${withLocalePrefix("/", locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.seo.siteName,
    url,
    description: options?.description ?? dict.seo.pages.home.description,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: dict.seo.siteName,
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  locale?: Locale;
}) {
  const locale = article.locale ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    inLanguage: locale,
    url: `${siteConfig.url}${withLocalePrefix(`/blog/${article.slug}`, locale)}`,
  };
}
