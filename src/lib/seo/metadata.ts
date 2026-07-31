import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";
import { hreflangLanguages, withLocalePrefix } from "@/i18n/routing";

export type SeoPageKey = "home" | "inventory" | "about" | "pricing" | "blog" | "contact";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  hi: "hi_IN",
  bn: "bn_BD",
};

interface BuildLocalizedMetadataOptions {
  locale: Locale;
  page: SeoPageKey;
  /** Path without locale prefix, e.g. `/` or `/inventory` */
  path?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export function buildLocalizedMetadata({
  locale,
  page,
  path = page === "home" ? "/" : `/${page}`,
  title,
  description,
  noIndex = false,
}: BuildLocalizedMetadataOptions): Metadata {
  const dict = getDictionary(locale);
  const seoPage = dict.seo.pages[page];
  const pageTitle = title ?? seoPage.title;
  const pageDescription = description ?? seoPage.description;
  const documentTitle = dict.seo.titleTemplate.replace("{title}", pageTitle);
  const localizedPath = withLocalePrefix(path, locale);
  const canonical = `${siteConfig.url}${localizedPath}`;
  const languages = hreflangLanguages(path);
  const absoluteLanguages = Object.fromEntries(
    Object.entries(languages).map(([key, hrefPath]) => [key, `${siteConfig.url}${hrefPath}`]),
  );

  const alternateLocales = (["en", "es", "hi", "bn"] as Locale[])
    .filter((code) => code !== locale)
    .map((code) => OG_LOCALE[code]);

  return {
    title: documentTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: absoluteLanguages,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: dict.seo.siteName,
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales,
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    other: {
      "content-language": locale,
    },
  };
}

/** @deprecated Prefer buildLocalizedMetadata for indexable marketing pages */
export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  return buildLocalizedMetadata({
    locale: defaultLocale,
    page: "home",
    path: path || "/",
    title,
    description,
    noIndex,
  });
}
