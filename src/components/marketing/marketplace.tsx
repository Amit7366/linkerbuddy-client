"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import {
  MARKETPLACE_FILTERS,
  SORT_OPTIONS,
  type FilterKey,
  type SiteListing,
} from "@/config/landing";
import { filterAndSortSites, type SortValue } from "@/lib/site-listings";
import { SiteListingRow } from "@/components/marketing/site-listing-row";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 10;

export function Marketplace() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortValue>("recommended");
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);
  const t = useTranslations();

  const sites = useMemo(() => filterAndSortSites(filter, sort), [filter, sort]);
  const previewSites = sites.slice(0, PREVIEW_COUNT);

  return (
    <section id="marketplace" className="lb-section" aria-labelledby="marketplace-heading">
      <Container>
        <Reveal>
          <SectionHeading
            align="split"
            id="marketplace-heading"
            kicker={t("marketplace.kicker")}
            title={t("marketplace.title")}
            description={t("marketplace.description")}
            badge={t("marketplace.badge")}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="mt-[29px] mb-[23px] flex gap-2.5 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:grid tablet:grid-cols-7 tablet:overflow-visible tablet:pr-0"
            role="group"
            aria-label="Quick site filters"
          >
            {MARKETPLACE_FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "flex min-w-[132px] cursor-pointer items-center gap-2.5 rounded-[10px] border border-line bg-card px-2.5 py-3 text-left hover:border-[#72a9f8] hover:bg-sky hover:shadow-[0_5px_18px_#2067d317] tablet:min-w-0",
                  filter === item.key && "border-[#72a9f8] bg-sky shadow-[0_5px_18px_#2067d317]",
                )}
              >
                <span
                  className={cn(
                    "grid size-[29px] place-items-center rounded-lg bg-sky font-extrabold text-brand",
                    filter === item.key && "bg-brand text-white",
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex flex-col gap-0.5">
                  <b className="text-[10px] text-ink">{t(`marketplace.filters.${item.key}.label`)}</b>
                  <small className="text-[8px] text-muted">
                    {t(`marketplace.filters.${item.key}.sub`)}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mb-3 flex flex-col items-start justify-between gap-2.5 text-[11px] tablet:flex-row tablet:items-center">
          <span className="text-muted">
            <b className="text-ink">
              {t("marketplace.verified", { count: sites.length })}
            </b>{" "}
            · {t("marketplace.updated")}
          </span>
          <label className="flex items-center gap-2 text-muted">
            {t("marketplace.sortBy")}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="rounded-lg border border-line bg-card px-3 py-2 text-[11px] text-ink"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`marketplace.sort.${option.value}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Reveal delay={0.12}>
          <div
            className="overflow-hidden rounded-xl border-0 shadow-none tablet:border tablet:border-line tablet:bg-card tablet:shadow-[var(--shadow-table)]"
            role="table"
            aria-label="Guest post inventory"
          >
            <div
              className="hidden min-h-[42px] grid-cols-[1.45fr_0.65fr_0.28fr_0.28fr_0.65fr_0.6fr_0.55fr_0.45fr_0.75fr] items-center bg-navy px-[15px] text-[9px] tracking-[0.4px] text-[#d8e3f2] uppercase tablet:grid"
              role="row"
            >
              <span>{t("marketplace.columns.website")}</span>
              <span>{t("marketplace.columns.niche")}</span>
              <span>{t("marketplace.columns.da")}</span>
              <span>{t("marketplace.columns.dr")}</span>
              <span>{t("marketplace.columns.traffic")}</span>
              <span>{t("marketplace.columns.country")}</span>
              <span>{t("marketplace.columns.guestPost")}</span>
              <span>{t("marketplace.columns.tat")}</span>
              <span>{t("marketplace.columns.action")}</span>
            </div>

            {previewSites.map((site) => (
              <SiteListingRow key={site.id} site={site} onView={setDetailSite} />
            ))}
          </div>
        </Reveal>

        <Link
          href="/inventory"
          className="mx-auto mt-[22px] flex w-fit items-center justify-center rounded-[10px] border border-line bg-card px-4 py-2.5 text-[11px] font-bold text-ink transition-colors hover:bg-sky"
        >
          {t("marketplace.viewMore")}
        </Link>
      </Container>

      <SiteDetailModal
        site={detailSite}
        open={Boolean(detailSite)}
        onClose={() => setDetailSite(null)}
      />
    </section>
  );
}
