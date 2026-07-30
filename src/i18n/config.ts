export const locales = ["en", "es", "hi", "bn"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const localeMeta: Record<
  Locale,
  { name: string; nativeName: string; flag: string; country: string; dir: "ltr" | "rtl" }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    country: "United States",
    dir: "ltr",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    country: "Spain",
    dir: "ltr",
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    country: "India",
    dir: "ltr",
  },
  bn: {
    name: "Bangla",
    nativeName: "বাংলা",
    flag: "🇧🇩",
    country: "Bangladesh",
    dir: "ltr",
  },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && locales.includes(value as Locale);
}
