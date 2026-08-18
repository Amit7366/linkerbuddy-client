"use client";

import { Eye } from "lucide-react";
import {
  COUNTRY_FLAGS,
  formatTraffic,
  type SiteListing,
} from "@/config/landing";
import { useShortlist } from "@/providers/shortlist-provider";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface SiteListingRowProps {
  site: SiteListing;
  onView: (site: SiteListing) => void;
  gridClassName?: string;
}

export function SiteListingRow({ site, onView, gridClassName }: SiteListingRowProps) {
  const { selectedIds, toggle } = useShortlist();
  const t = useTranslations();
  const selected = selectedIds.includes(site.id);
  const flag = COUNTRY_FLAGS[site.country] ?? "🌐";

  return (
    <div
      role="row"
      className={cn(
        "mb-2.5 grid grid-cols-3 gap-3.5 rounded-xl border border-line bg-card p-[15px] text-[11px] text-ink tablet:mb-0 tablet:min-h-[65px] tablet:items-center tablet:gap-0 tablet:rounded-none tablet:border-0 tablet:border-t tablet:border-line tablet:px-[15px] tablet:py-0 tablet:hover:bg-sky",
        gridClassName ??
          "tablet:grid-cols-[1.45fr_0.65fr_0.28fr_0.28fr_0.65fr_0.6fr_0.55fr_0.45fr_0.75fr]",
        selected && "bg-sky dark:bg-[#15233a]",
      )}
    >
      <div className="col-span-3 flex items-center gap-2.5 tablet:col-span-1">
        <button
          type="button"
          aria-label={`Select ${site.domain}`}
          aria-pressed={selected}
          onClick={() => toggle(site.id)}
          className={cn(
            "grid size-[25px] place-items-center rounded-[7px] border border-[#483EF4] bg-card text-sm font-bold text-[#483EF4]",
            selected && "border-[#483EF4] bg-[#483EF4] text-white",
          )}
        >
          {selected ? "✓" : "+"}
        </button>
        <div className="flex min-w-0 flex-col gap-1">
          <b className="truncate text-[11px] text-ink">{site.domain}</b>
          <small className="text-[8px] text-muted">
            <span
              className={cn(
                "rounded px-1.5 py-0.5",
                site.owner === "Admin"
                  ? "bg-[#daf5eb] text-[#07805d] dark:bg-[#0f3d32] dark:text-[#34d399]"
                  : "bg-[#fff0d8] text-[#a86500] dark:bg-[#3d2e0f] dark:text-[#fbbf24]",
              )}
            >
              {site.owner}
            </span>
            {" · "}
            {site.trend} ↗
          </small>
        </div>
      </div>

      <span
        data-label="Niche"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        {site.niche}
      </span>
      <span
        data-label="DA"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        {site.da}
      </span>
      <span
        data-label="DR"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        {site.dr}
      </span>
      <strong
        data-label="Traffic"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        {formatTraffic(site.traffic)}
      </strong>
      <span
        data-label="Country"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        {flag} {site.country}
      </span>
      <strong
        data-label="Guest post"
        className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
      >
        ${site.guest}{" "}
        <small className="text-[8px] font-normal text-muted">/ post</small>
      </strong>
      <span
        data-label="TAT"
        className="hidden text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:block tablet:before:hidden"
      >
        {site.tat}
      </span>

      <div className="col-span-3 flex items-center gap-2 tablet:col-span-1">
        <button
          type="button"
          onClick={() => onView(site)}
          aria-label={t("inventory.viewDetails", { domain: site.domain })}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#483EF4] bg-surface text-[#483EF4] transition-colors hover:bg-[#483EF4]/10"
        >
          <Eye className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => toggle(site.id)}
          data-selected={selected ? "true" : "false"}
          className="lb-add-site"
        >
          {selected ? t("marketplace.selected") : t("marketplace.addSite")}
        </button>
      </div>
    </div>
  );
}
