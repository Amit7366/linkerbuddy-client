"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  MARKETPLACE_FILTERS,
  SORT_OPTIONS,
  type FilterKey,
  type SiteListing,
} from "@/config/landing";
import type { SortValue } from "@/lib/site-listings";
import { listMarketplace } from "@/lib/api/marketplace";
import { useTranslations } from "@/providers/locale-provider";
import { SiteListingRow } from "@/components/marketing/site-listing-row";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import { InventorySkeletonList } from "@/components/marketing/inventory-skeleton";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const ease = [0.22, 1, 0.36, 1] as const;

export function InventoryBrowser() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortValue>("recommended");
  const [page, setPage] = useState(1);
  const [sites, setSites] = useState<SiteListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);
  const [, startTransition] = useTransition();

  const fetchPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      const data = await listMarketplace({
        filter,
        sort,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setTotal(data.total);
      setSites((prev) => (replace ? data.listings : [...prev, ...data.listings]));
      setPage(nextPage);
    },
    [filter, sort],
  );

  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    setSites([]);
    setPage(1);
    void fetchPage(1, true)
      .catch(() => {
        if (!cancelled) {
          setSites([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const hasMore = sites.length < total;
  const remaining = Math.max(0, total - sites.length);

  const handleFilter = (key: FilterKey) => {
    startTransition(() => {
      setFilter(key);
    });
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, false);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, loadingMore, page]);

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
            href="/#marketplace"
            className="inline-flex w-fit items-center rounded-lg border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink transition-colors hover:bg-sky"
          >
            ← {t("inventory.backHome")}
          </Link>
        </div>

        <div
          className="mb-5 flex gap-2.5 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:grid tablet:grid-cols-7 tablet:overflow-visible tablet:pr-0"
          role="group"
          aria-label="Quick site filters"
        >
          {MARKETPLACE_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleFilter(item.key)}
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

        <div className="mb-3 flex flex-col items-start justify-between gap-2.5 text-[11px] tablet:flex-row tablet:items-center">
          <span className="text-muted">
            <b className="text-ink">
              {t("inventory.showing", {
                shown: sites.length,
                total,
              })}
            </b>{" "}
            · {t("marketplace.updated")}
          </span>
          <label className="flex items-center gap-2 text-muted">
            {t("marketplace.sortBy")}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortValue);
              }}
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
                <InventorySkeletonList count={Math.min(PAGE_SIZE, remaining)} />
              ) : null}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {!initialLoading && hasMore ? (
            <Button
              variant="ghost"
              disabled={loadingMore}
              className="min-w-[200px] border border-line px-5 py-3 text-[12px] font-bold text-ink shadow-none disabled:opacity-70"
              onClick={() => void loadMore()}
            >
              {loadingMore ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {t("inventory.loading")}
                </span>
              ) : (
                t("inventory.loadMore", { count: Math.min(PAGE_SIZE, remaining) })
              )}
            </Button>
          ) : null}

          {!initialLoading && !hasMore ? (
            <p className="text-[11px] text-muted">
              {t("inventory.allLoaded", { total })}
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
