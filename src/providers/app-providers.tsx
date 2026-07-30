"use client";

import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import type { Locale } from "@/i18n/config";

interface AppProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export function AppProviders({ children, locale }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider initialLocale={locale}>
        <QueryProvider>{children}</QueryProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
