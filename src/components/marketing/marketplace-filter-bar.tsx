"use client";

import { MARKETPLACE_FILTERS, type FilterKey } from "@/config/landing";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface MarketplaceFilterBarProps {
  isSelected: (key: FilterKey) => boolean;
  onToggle: (key: FilterKey) => void;
  className?: string;
}

export function MarketplaceFilterBar({
  isSelected,
  onToggle,
  className,
}: MarketplaceFilterBarProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex gap-2.5 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:grid tablet:grid-cols-7 tablet:overflow-visible tablet:pr-0",
        className,
      )}
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
            className={cn(
              "flex min-w-[132px] cursor-pointer items-center gap-2.5 rounded-[10px] border border-line bg-card px-2.5 py-3 text-left transition-colors hover:border-[#72a9f8] hover:bg-sky hover:shadow-[0_5px_18px_#2067d317] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand tablet:min-w-0",
              pressed && "border-[#72a9f8] bg-sky shadow-[0_5px_18px_#2067d317]",
            )}
          >
            <span
              className={cn(
                "grid size-[29px] place-items-center rounded-lg bg-sky font-extrabold text-brand",
                pressed && "bg-brand text-white",
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
    </div>
  );
}
