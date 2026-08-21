"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { MARKETPLACE_FILTERS, type FilterKey } from "@/config/landing";
import { marketplaceCountries } from "@/config/nav";
import { useTranslations } from "@/providers/locale-provider";
import { CustomMarketplaceFilterModal } from "@/components/marketing/custom-marketplace-filter-modal";
import {
  EMPTY_CUSTOM_FILTER,
  type CustomMarketplaceFilter,
} from "@/lib/marketplace-filters";
import { cn } from "@/lib/utils";

interface MarketplaceFilterBarProps {
  isSelected: (key: FilterKey) => boolean;
  onToggle: (key: FilterKey) => void;
  isCountrySelected?: (code: string) => boolean;
  onSelectCountry?: (code: string | null) => void;
  customActive?: boolean;
  customFilter?: CustomMarketplaceFilter;
  onApplyCustom?: (filter: CustomMarketplaceFilter) => void;
  onResetCustom?: () => void;
  className?: string;
}

export function MarketplaceFilterBar({
  isSelected,
  onToggle,
  isCountrySelected,
  onSelectCountry,
  customActive = false,
  customFilter,
  onApplyCustom,
  onResetCustom,
  className,
}: MarketplaceFilterBarProps) {
  const t = useTranslations();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 6);
    setCanNext(max > 6 && el.scrollLeft < max - 6);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateOverflow();
    el.addEventListener("scroll", updateOverflow, { passive: true });
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateOverflow);
      observer.disconnect();
    };
  }, [updateOverflow]);

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.72, 148);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  const chipClass = (pressed: boolean) =>
    cn(
      "flex min-w-[132px] cursor-pointer items-center gap-2.5 rounded-[10px] border border-line bg-card px-2.5 py-3 text-left transition-colors hover:border-[#483EF4] hover:bg-[#483EF4]/8 hover:shadow-[0_5px_18px_#483EF417] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#483EF4] tablet:min-w-0",
      pressed && "border-[#483EF4] bg-[#483EF4]/8 shadow-[0_5px_18px_#483EF417]",
    );

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <button
          type="button"
          aria-label={t("marketplace.prevFilters")}
          disabled={!canPrev}
          onClick={() => scrollByPage(-1)}
          className={cn(
            "absolute top-1/2 left-1 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-[#483EF4] shadow-[0_6px_16px_#483EF428] tablet:hidden",
            canPrev ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t("marketplace.nextFilters")}
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
          className={cn(
            "absolute top-1/2 right-1 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-[#483EF4] shadow-[0_6px_16px_#483EF428] tablet:hidden",
            canNext ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>

        <div
          ref={scrollerRef}
          className="flex flex-nowrap gap-2.5 overflow-x-auto pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:grid tablet:grid-cols-4 tablet:overflow-visible tablet:pr-0"
          role="group"
          aria-label={t("marketplace.filterGroup")}
        >
        {MARKETPLACE_FILTERS.map((item) => {
          const pressed = isSelected(item.key);
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={pressed}
              onClick={() => onToggle(item.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(item.key);
                }
              }}
              className={chipClass(pressed)}
            >
              <span
                className={cn(
                  "grid size-[29px] place-items-center rounded-lg bg-[#483EF4]/10 font-extrabold text-[#483EF4]",
                  pressed && "bg-[#483EF4] text-white",
                )}
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="flex flex-col gap-0.5">
                <b className="text-[10px] text-ink">
                  {t(`marketplace.filters.${item.key}.label`)}
                </b>
                <small className="text-[8px] text-muted">
                  {t(`marketplace.filters.${item.key}.sub`)}
                </small>
              </span>
            </button>
          );
        })}

        {onApplyCustom && customFilter ? (
          <button
            type="button"
            aria-pressed={customActive}
            aria-haspopup="dialog"
            onClick={() => setCustomOpen(true)}
            className={chipClass(customActive)}
          >
            <span
              className={cn(
                "grid size-[29px] place-items-center rounded-lg bg-[#483EF4]/10 text-[#483EF4]",
                customActive && "bg-[#483EF4] text-white",
              )}
              aria-hidden
            >
              <SlidersHorizontal className="size-3.5" />
            </span>
            <span className="flex flex-col gap-0.5">
              <b className="text-[10px] text-ink">{t("marketplace.custom.label")}</b>
              <small className="text-[8px] text-muted">{t("marketplace.custom.sub")}</small>
            </span>
          </button>
        ) : null}
        </div>
      </div>

      {onSelectCountry && isCountrySelected ? (
        <div
          className="mt-2 flex flex-nowrap gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:mt-3 tablet:flex-wrap tablet:overflow-visible"
          role="group"
          aria-label={t("marketplace.countryGroup")}
        >
          <button
            type="button"
            aria-pressed={!marketplaceCountries.some((item) => isCountrySelected(item.code))}
            onClick={() => onSelectCountry(null)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors",
              !marketplaceCountries.some((item) => isCountrySelected(item.code))
                ? "border-[#483EF4] bg-[#483EF4]/10 text-[#483EF4]"
                : "border-line bg-card text-ink hover:border-[#483EF4] hover:bg-[#483EF4]/8",
            )}
          >
            {t("marketplace.allCountries")}
          </button>
          {marketplaceCountries.map((item) => {
            const pressed = isCountrySelected(item.code);
            return (
              <button
                key={item.code}
                type="button"
                aria-pressed={pressed}
                onClick={() => onSelectCountry(item.code)}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors",
                  pressed
                    ? "border-[#483EF4] bg-[#483EF4]/10 text-[#483EF4]"
                    : "border-line bg-card text-ink hover:border-[#483EF4] hover:bg-[#483EF4]/8",
                )}
              >
                <span aria-hidden>{item.flag}</span>
                {t(`marketplaceCountries.${item.code}.name`)}
              </button>
            );
          })}
        </div>
      ) : null}

      {onApplyCustom && customFilter ? (
        <CustomMarketplaceFilterModal
          open={customOpen}
          value={customFilter}
          onClose={() => setCustomOpen(false)}
          onApply={onApplyCustom}
          onReset={onResetCustom ?? (() => onApplyCustom(EMPTY_CUSTOM_FILTER))}
        />
      ) : null}
    </div>
  );
}
