"use client";

import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import {
  marketplaceCountries,
  type MarketplaceCountry,
  type MarketplaceCountryCode,
} from "@/config/nav";
import { countryCodeToFilterParam, normalizeCountryParam } from "@/lib/marketplace-filters";
import { stripLocalePrefix, withLocalePrefix } from "@/i18n/routing";
import { useTranslations } from "@/providers/locale-provider";
import { scrollToHomeSection } from "@/hooks/use-active-home-nav";
import { cn } from "@/lib/utils";

interface MarketplaceDropdownProps {
  className?: string;
  onSelect?: (country: MarketplaceCountry) => void;
  fullWidth?: boolean;
  /** Matches other nav items: orange label + short underline when Marketplace is the active section/page. */
  active?: boolean;
}

function codeFromCountryParam(country: string | null): MarketplaceCountryCode | null {
  if (!country) return null;
  const normalized = normalizeCountryParam(country).toLowerCase();
  const match = marketplaceCountries.find(
    (item) => countryCodeToFilterParam(item.code).toLowerCase() === normalized,
  );
  return match?.code ?? null;
}

function MarketplaceDropdownInner({
  className,
  onSelect,
  fullWidth = false,
  active = false,
}: MarketplaceDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MarketplaceCountryCode>("IN");
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCountryCode = useMemo(
    () => codeFromCountryParam(searchParams.get("country")),
    [searchParams],
  );

  useEffect(() => {
    if (urlCountryCode) setSelected(urlCountryCode);
  }, [urlCountryCode]);

  const selectedCountry =
    marketplaceCountries.find((c) => c.code === selected) ?? marketplaceCountries[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (country: MarketplaceCountry) => {
    setSelected(country.code);
    setOpen(false);
    onSelect?.(country);

    const next = new URLSearchParams(searchParams.toString());
    // Drop chip-implied India when switching markets from the navbar
    if (next.get("country")?.toLowerCase() === "india") {
      // replace with selected market
    }
    next.set("country", countryCodeToFilterParam(country.code).toLowerCase());

    const qs = next.toString();
    const { locale, pathname: barePath } = stripLocalePrefix(pathname);
    const activeLocale = locale ?? "en";

    if (barePath === "/inventory") {
      router.push(
        qs
          ? `${withLocalePrefix("/inventory", activeLocale)}?${qs}`
          : withLocalePrefix("/inventory", activeLocale),
      );
      return;
    }

    router.push(
      qs
        ? `${withLocalePrefix("/", activeLocale)}?${qs}#marketplace`
        : `${withLocalePrefix("/", activeLocale)}#marketplace`,
    );
    window.setTimeout(() => {
      scrollToHomeSection("marketplace");
    }, 80);
  };

  return (
    <div ref={rootRef} className={cn("relative", fullWidth && "w-full", className)}>
      <button
        type="button"
        className={cn(
          "relative inline-flex items-center gap-1.5 border-0 bg-transparent text-[13px] font-semibold transition-colors",
          fullWidth && "w-full justify-between py-1",
          active
            ? "text-[var(--orange)] after:absolute after:right-0 after:-bottom-1 after:left-0 after:mx-auto after:h-[2px] after:w-4 after:rounded-full after:bg-[var(--orange)]"
            : open
              ? "text-white"
              : "text-[var(--nav-link)] hover:text-white",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-current={active ? "true" : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden>
            {selectedCountry.flag}
          </span>
          {t("nav.marketplace")}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
          className="inline-flex"
        >
          <ChevronDown className="size-3.5 opacity-80" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={t("nav.chooseMarket")}
            initial={
              reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "z-[70] overflow-hidden rounded-xl border border-white/10 bg-navy p-1.5 shadow-[var(--shadow-overlay)]",
              fullWidth
                ? "relative mt-2 w-full"
                : "absolute top-[calc(100%+12px)] left-1/2 w-[280px] -translate-x-1/2 tablet:left-0 tablet:translate-x-0",
            )}
          >
            <div className="mb-1 px-2.5 pt-1.5 pb-1 text-[9px] font-bold tracking-[1.2px] text-white/50 uppercase">
              {t("nav.chooseMarket")}
            </div>

            <ul className="m-0 max-h-[320px] list-none space-y-0.5 overflow-y-auto p-0">
              {marketplaceCountries.map((country, index) => {
                const isActive = country.code === selected;
                return (
                  <motion.li
                    key={country.code}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.03 * index,
                      duration: 0.18,
                    }}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(country)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-[10px] border-0 px-2.5 py-2.5 text-left transition-colors",
                        isActive
                          ? "bg-brand/20 text-white"
                          : "bg-transparent text-white/80 hover:bg-white/8 hover:text-white",
                      )}
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-xl leading-none"
                        aria-hidden
                      >
                        {country.flag}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold">
                          {t(`marketplaceCountries.${country.code}.name`)}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-white/55">
                          {t(`marketplaceCountries.${country.code}.description`)}
                        </span>
                      </span>
                      {isActive ? (
                        <Check className="size-4 shrink-0 text-[var(--logo-accent)]" aria-hidden />
                      ) : null}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function MarketplaceDropdown(props: MarketplaceDropdownProps) {
  return (
    <Suspense
      fallback={
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--nav-link)]">
          {props.fullWidth ? null : "Marketplace"}
        </span>
      }
    >
      <MarketplaceDropdownInner {...props} />
    </Suspense>
  );
}
