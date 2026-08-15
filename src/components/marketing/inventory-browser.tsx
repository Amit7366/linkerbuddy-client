"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SORT_OPTIONS, type SiteListing } from "@/config/landing";
import type { SortValue } from "@/lib/site-listings";
import { listMarketplace } from "@/lib/api/marketplace";
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters";
import { useTranslations, useLocale } from "@/providers/locale-provider";
import { MarketplaceFilterBar } from "@/components/marketing/marketplace-filter-bar";
import { SiteListingRow } from "@/components/marketing/site-listing-row";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import { InventorySkeletonList } from "@/components/marketing/inventory-skeleton";
import { HomeSkeleton } from "@/components/ui/skeleton";
import { withLocalePrefix } from "@/i18n/routing";

const PAGE_SIZE = 12;
const ease = [0.22, 1, 0.36, 1] as const;

function InventoryBrowserInner() {
  const t = useTranslations();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [page, setPage] = useState(1);
  const [sites, setSites] = useState<SiteListing[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
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
  } = useMarketplaceFilters();

  const fetchPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      const data = await listMarketplace(toApiParams(nextPage, PAGE_SIZE));
      setTotal(data.total);
      setSites((prev) => (replace ? data.listings : [...prev, ...data.listings]));
      setPage(nextPage);
    },
    [toApiParams],
  );

  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    setListError(false);
    setSites([]);
    setTotal(null);
    setPage(1);
    void fetchPage(1, true)
      .catch(() => {
        if (!cancelled) {
          setSites([]);
          setTotal(null);
          setListError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const safeTotal = total ?? 0;
  const hasMore = sites.length < safeTotal;
  const remaining = Math.max(0, safeTotal - sites.length);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore || initialLoading || listError) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, false);
    } catch {
      // Keep existing rows; user can scroll again to retry.
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, initialLoading, listError, page]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || initialLoading || listError || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { root: null, rootMargin: "280px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, initialLoading, listError, loadMore, sites.length]);

  return (
    <div className="pb-16 pt-8 tablet:pt-12">
      <Container>
        <div className="mb-8 flex flex-col gap-4 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold tracking-[1.4px] text-brand uppercase">
              {t("inventory.kicker")}
            </p>
            <h1 className="mt-2 text-[28px] leading-tight font-extrabold tracking-[-0.6px] text-ink tablet:text-[36px]">
              {t("inventory.title")}
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {t("inventory.description")}
            </p>
          </div>
          <Link
            href={`${withLocalePrefix("/", locale)}#marketplace`}
            className="inline-flex w-fit items-center rounded-lg border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink transition-colors hover:bg-sky"
          >
            ← {t("inventory.backHome")}
          </Link>
        </div>

        <MarketplaceFilterBar
          className="mb-5"
          isSelected={isSelected}
          onToggle={toggleFilter}
          isCountrySelected={isCountrySelected}
          onSelectCountry={toggleCountry}
          customActive={customActive}
          customFilter={customFilter}
          onApplyCustom={applyCustomFilter}
          onResetCustom={clearCustomFilter}
        />

        <div className="mb-3 flex flex-col items-start justify-between gap-2.5 text-[11px] tablet:flex-row tablet:items-center">
          <span className="text-muted">
            {initialLoading || total === null ? (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-line/60" />
            ) : (
              <>
                <b className="text-ink">
                  {t("inventory.showing", {
                    shown: sites.length,
                    total,
                  })}
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

          {initialLoading ? (
            <InventorySkeletonList count={PAGE_SIZE} />
          ) : listError ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <p className="m-0 text-[12px] text-muted">{t("marketplace.verifiedError")}</p>
              <button
                type="button"
                onClick={() => {
                  setInitialLoading(true);
                  void fetchPage(1, true)
                    .catch(() => setListError(true))
                    .finally(() => setInitialLoading(false));
                }}
                className="cursor-pointer rounded-lg border border-line bg-sky px-3 py-2 text-[11px] font-bold text-brand hover:bg-brand hover:text-white"
              >
                {t("marketplace.retry")}
              </button>
            </div>
          ) : sites.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <p className="m-0 text-[14px] font-bold text-ink">
                {t("marketplace.emptyTitle")}
              </p>
              <p className="m-0 max-w-sm text-[12px] text-muted">
                {t("marketplace.emptyDescription")}
              </p>
              {constrained ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer rounded-lg border border-line bg-sky px-3 py-2 text-[11px] font-bold text-brand hover:bg-brand hover:text-white"
                >
                  {t("marketplace.clearFilters")}
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {sites.map((site, index) => (
                  <motion.div
                    key={site.id}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      ease,
                      delay: reduce ? 0 : Math.min(index % PAGE_SIZE, 8) * 0.03,
                    }}
                  >
                    <SiteListingRow site={site} onView={setDetailSite} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {loadingMore ? (
                <InventorySkeletonList count={Math.min(PAGE_SIZE, remaining || PAGE_SIZE)} />
              ) : null}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {!initialLoading && !listError && hasMore ? (
            <div
              ref={loadMoreRef}
              className="flex min-h-10 w-full items-center justify-center py-2"
              aria-hidden={!loadingMore}
            >
              {loadingMore ? (
                <span className="inline-flex items-center gap-2 text-[12px] text-muted">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {t("inventory.loading")}
                </span>
              ) : (
                <span className="sr-only">{t("inventory.loading")}</span>
              )}
            </div>
          ) : null}

          {!initialLoading && !listError && sites.length > 0 && !hasMore ? (
            <p className="text-[11px] text-muted">
              {t("inventory.allLoaded", { total: safeTotal })}
            </p>
          ) : null}
        </div>
      </Container>

      <SiteDetailModal
        site={detailSite}
        open={Boolean(detailSite)}
        onClose={() => setDetailSite(null)}
      />
    </div>
  );
}

export function InventoryBrowser() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <InventoryBrowserInner />
    </Suspense>
  );
}
