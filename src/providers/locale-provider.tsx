"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { localeMeta, type Locale } from "@/i18n/config";
import { writeLocaleCookie } from "@/i18n/cookie";
import { getDictionary, getMessage } from "@/i18n";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback((next: Locale) => {
    startTransition(() => {
      setLocaleState(next);
      writeLocaleCookie(next);
      document.documentElement.lang = next;
      document.documentElement.dir = localeMeta[next].dir;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].dir;
  }, [locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => getMessage(dictionary, key, vars),
    [dictionary],
  );

  const value = useMemo(
    () => ({ locale, dictionary, setLocale, t, isPending }),
    [locale, dictionary, setLocale, t, isPending],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}
