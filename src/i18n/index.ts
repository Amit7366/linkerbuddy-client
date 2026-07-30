import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { hi } from "@/i18n/dictionaries/hi";
import { bn } from "@/i18n/dictionaries/bn";

const dictionaries: Record<Locale, Dictionary> = { en, es, hi, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function resolveLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}

type Primitive = string | number | boolean | null | undefined;

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Primitive
    ? Key
    : T[Key] extends readonly unknown[]
      ? Key
      : T[Key] extends object
        ? `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
        : Key
  : never;

export type MessageKey = PathImpl<Dictionary, keyof Dictionary>;

export function getMessage(
  dictionary: Dictionary,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const parts = key.split(".");
  let current: unknown = dictionary;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  if (typeof current !== "string") return key;

  if (!vars) return current;

  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    current,
  );
}
