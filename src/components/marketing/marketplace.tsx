"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton, HomeSkeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion/reveal";
import { SORT_OPTIONS, type SiteListing } from "@/config/landing";
import type { SortValue } from "@/lib/site-listings";
import { listMarketplace } from "@/lib/api/marketplace";
import { useMarketplaceStats } from "@/hooks/use-marketplace-stats";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { useIsomorphicLayoutReady } from "@/hooks/use-isomorphic-layout-ready";
import { MarketplaceFilterBar } from "@/components/marketing/marketplace-filter-bar";
import { SiteListingRow } from "@/components/marketing/site-listing-row";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import { useTranslations, useLocale } from "@/providers/locale-provider";
import { buildInventoryHref } from "@/lib/marketplace-filters";

const PREVIEW_COUNT = 10;

function MarketplaceInner() {
  const [previewSites, setPreviewSites] = useState<SiteListing[]>([]);
  const [filteredTotal, setFilteredTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);
  const t = useTranslations();
  const { locale } = useLocale();
  const layoutReady = useIsomorphicLayoutReady();
  const {
    data: stats,
    isError: statsError,
    isSuccess: statsSuccess,
    refetch: refetchStats,
  } = useMarketplaceStats();
  const {
    sort,
    constrained,
    toggleFilter,
    toggleCountry,
    isCountrySelected,
    clearFilters,
    setSort,
    toApiParams,
    isSelected,
    customFilter,
    customActive,
    applyCustomFilter,
    clearCustomFilter,
  } = useMarketplaceFilters({ hash: "#marketplace" });
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setListError(false);
    setFilteredTotal(null);

    void listMarketplace(toApiParams(1, PREVIEW_COUNT))
      .then((data) => {
        if (cancelled) return;
        setPreviewSites(data.listings);
        setFilteredTotal(data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setPreviewSites([]);
        setFilteredTotal(null);
        setListError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [toApiParams, reloadToken]);

  const inventoryTotal =
    !constrained && layoutReady && statsSuccess && stats
      ? stats.total
      : filteredTotal;

  const badgeContent = !layoutReady ? (
    <Skeleton className="h-3 w-28 rounded-full" />
  ) : statsSuccess && stats ? (
    t("marketplace.badge", { count: stats.total })
  ) : statsError ? (
    t("marketplace.verifiedError")
  ) : (
    <Skeleton className="h-3 w-28 rounded-full" />
  );

  const emptyState = (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="m-0 text-[14px] font-bold text-ink">{t("marketplace.emptyTitle")}</p>
      <p className="m-0 max-w-sm text-[12px] text-muted">{t("marketplace.emptyDescription")}</p>
      <button
        type="button"
        onClick={clearFilters}
        className="cursor-pointer rounded-lg border border-line bg-sky px-3 py-2 text-[11px] font-bold text-brand hover:bg-brand hover:text-white"
      >
        {t("marketplace.clearFilters")}
      </button>
    </div>
  );

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
            badge={badgeContent}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <MarketplaceFilterBar
            className="mt-[29px] mb-[23px]"
            isSelected={isSelected}
            onToggle={toggleFilter}
            isCountrySelected={isCountrySelected}
            onSelectCountry={toggleCountry}
            customActive={customActive}
            customFilter={customFilter}
            onApplyCustom={applyCustomFilter}
            onResetCustom={clearCustomFilter}
          />
        </Reveal>

        <div className="mb-3 flex flex-col items-start justify-between gap-2.5 text-[11px] tablet:flex-row tablet:items-center">
          <span className="flex items-center gap-2 text-muted">
            {layoutReady && listError ? (
              <>
                <span>{t("marketplace.verifiedError")}</span>
                <button
                  type="button"
                  onClick={() => {
                    void refetchStats();
                    setReloadToken((n) => n + 1);
                  }}
                  className="cursor-pointer rounded-md border border-line bg-card px-2 py-1 text-[10px] font-bold text-brand hover:bg-sky"
                >
                  {t("marketplace.retry")}
                </button>
              </>
            ) : !layoutReady || loading || inventoryTotal === null ? (
              <>
                <Skeleton className="h-4 w-36 rounded" />
                <span>· {t("marketplace.updated")}</span>
              </>
            ) : (
              <>
                <b className="text-ink">
                  {t("marketplace.verified", { count: inventoryTotal })}
                </b>{" "}
                · {t("marketplace.updated")}
              </>
            )}
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
              className="hidden min-h-[42px] grid-cols-[1.45fr_0.65fr_0.28fr_0.28fr_0.65fr_0.6fr_0.55fr_0.45fr_0.75fr] items-center bg-navy px-[15px] text-[9px] tracking-[0.4px] text-white/75 uppercase tablet:grid"
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

            {loading ? (
              <p className="px-4 py-10 text-center text-[12px] text-muted">
                {t("marketplace.verifiedLoading")}
              </p>
            ) : listError ? (
              <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                <p className="m-0 text-[12px] text-muted">{t("marketplace.verifiedError")}</p>
                <button
                  type="button"
                  onClick={() => setReloadToken((n) => n + 1)}
                  className="cursor-pointer rounded-lg border border-line bg-sky px-3 py-2 text-[11px] font-bold text-brand hover:bg-brand hover:text-white"
                >
                  {t("marketplace.retry")}
                </button>
              </div>
            ) : previewSites.length === 0 ? (
              emptyState
            ) : (
              previewSites.map((site) => (
                <SiteListingRow key={site.id} site={site} onView={setDetailSite} />
              ))
            )}
          </div>
        </Reveal>

        <Link
          href={buildInventoryHref(searchParams, locale)}
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

export function Marketplace() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <MarketplaceInner />
    </Suspense>
  );
}
