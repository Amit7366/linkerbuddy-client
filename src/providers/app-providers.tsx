"use client";

import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { PagePreloader } from "@/components/layout/page-preloader";
import type { Locale } from "@/i18n/config";

interface AppProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export function AppProviders({ children, locale }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <LocaleProvider initialLocale={locale}>
          <QueryProvider>
            <PagePreloader />
            {children}
          </QueryProvider>
        </LocaleProvider>
      </Suspense>
    </ThemeProvider>
  );
}
