"use client";

import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { CartProvider } from "@/providers/shortlist-provider";
import { SessionProvider } from "@/providers/session-provider";
import { PagePreloader } from "@/components/layout/page-preloader";
import type { Locale } from "@/i18n/config";

interface AppProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export function AppProviders({ children, locale }: AppProvidersProps) {
  // SessionProvider must stay outside Suspense — LocaleProvider uses useSearchParams,
  // and remounting the suspense boundary was wiping in-memory auth on route changes.
  return (
    <ThemeProvider>
      <QueryProvider>
        <SessionProvider>
          <Suspense fallback={null}>
            <LocaleProvider initialLocale={locale}>
              <CartProvider>
                <PagePreloader />
                {children}
              </CartProvider>
            </LocaleProvider>
          </Suspense>
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
