"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Eye, Plus, Search, X } from "lucide-react";
import { formatTraffic, domainInitials, type SiteListing } from "@/config/landing";
import { listMarketplace } from "@/lib/api/marketplace";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useShortlist } from "@/providers/shortlist-provider";
import { useTranslations } from "@/providers/locale-provider";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface PlacementSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-brand"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

function avatarTone(domain: string): { wrap: string; text: string } {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = (hash + domain.charCodeAt(i) * (i + 1)) % 3;
  const tones = [
    {
      wrap: "bg-[#e8f1ff] dark:bg-[#1a2d4d]",
      text: "text-[#1a4a9e] dark:text-[#7db4ff]",
    },
    {
      wrap: "bg-navy/10 dark:bg-navy/25",
      text: "text-navy dark:text-[var(--logo-accent)]",
    },
    {
      wrap: "bg-[#e6f7f0] dark:bg-[#14352c]",
      text: "text-[#0a7a55] dark:text-[#6ee7b7]",
    },
  ] as const;
  return tones[hash]!;
}

function SearchResultRow({
  site,
  onView,
}: {
  site: SiteListing;
  onView: (site: SiteListing) => void;
}) {
  const t = useTranslations();
  const { selectedIds, toggle } = useShortlist();
  const selected = selectedIds.includes(site.id);
  const tone = avatarTone(site.domain);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
        "border-[#d6e6fb] bg-[#f7fbff] hover:border-[#b7d2f7] hover:bg-[#eef6ff]",
        "dark:border-white/10 dark:bg-[#0f1829] dark:hover:border-white/18 dark:hover:bg-[#152238]",
        selected &&
          "border-brand/40 bg-sky",
      )}
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl text-[12px] font-extrabold tracking-wide",
          tone.wrap,
          tone.text,
        )}
        aria-hidden
      >
        {domainInitials(site.domain)}
      </span>

      <div className="min-w-0 flex-1 basis-[140px]">
        <p className="m-0 truncate text-[14px] font-bold text-ink">{site.domain}</p>
        <p className="m-0 mt-0.5 truncate text-[12px] text-muted">
          {site.niche} · {site.country}
        </p>
      </div>

      <div className="hidden shrink-0 items-center gap-5 phablet:flex">
        <div className="min-w-[36px] text-center">
          <span className="block text-[10px] font-medium tracking-wide text-muted uppercase">
            {t("marketplace.columns.dr")}
          </span>
          <strong className="mt-0.5 block text-[15px] font-bold text-ink">{site.dr}</strong>
        </div>
        <div className="min-w-[52px] text-center">
          <span className="block text-[10px] font-medium tracking-wide text-muted uppercase">
            {t("inventory.modal.traffic")}
          </span>
          <strong className="mt-0.5 block text-[15px] font-bold text-ink">
            {formatTraffic(site.traffic)}
          </strong>
        </div>
      </div>

      <strong className="hidden min-w-[64px] shrink-0 text-right text-[16px] font-bold text-ink tablet:block">
        ${site.guest}+
      </strong>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span className="text-[13px] font-bold text-ink phablet:hidden">${site.guest}+</span>
        <button
          type="button"
          onClick={() => onView(site)}
          aria-label={t("inventory.viewDetails", { domain: site.domain })}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[10px] border transition-colors",
            "border-[#d0dceb] bg-white text-brand hover:border-brand hover:bg-sky",
            "dark:border-white/12 dark:bg-white/5 dark:text-brand dark:hover:border-brand dark:hover:bg-white/10",
          )}
        >
          <Eye className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => toggle(site.id)}
          data-selected={selected ? "true" : "false"}
          aria-label={selected ? t("marketplace.selected") : t("marketplace.addSite")}
          aria-pressed={selected}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[10px] border-0 text-white shadow-[var(--shadow-btn)] transition-colors",
            selected
              ? "bg-green hover:brightness-110"
              : "bg-brand hover:bg-brand-hover",
          )}
        >
          {selected ? (
            <Check className="size-4" aria-hidden strokeWidth={3} />
          ) : (
            <Plus className="size-5" aria-hidden strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 320);
  const searching = query.trim().length > 0 && query !== debouncedQuery;
  const [results, setResults] = useState<SiteListing[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);
  const detailOpen = Boolean(detailSite);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !detailOpen) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, detailOpen]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults([]);
      setLoadingResults(false);
      return;
    }

    let cancelled = false;
    setLoadingResults(true);
    void listMarketplace({ q, page: 1, limit: 8 })
      .then((data) => {
        if (!cancelled) setResults(data.listings);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingResults(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showLoading = searching || loadingResults;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-[12vh] tablet:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.button
        type="button"
        aria-label={t("search.close")}
        className="absolute inset-0 border-0 bg-navy/55 backdrop-blur-xl dark:bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-[780px] overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-overlay)] backdrop-blur-2xl dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search className="size-5 shrink-0 text-brand" aria-hidden />
          <div className="min-w-0 flex-1">
            <p id={titleId} className="sr-only">
              {t("search.title")}
            </p>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full border-0 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-2">
            {showLoading ? <LoadingDots /> : null}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("search.close")}
              className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-sky"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="max-h-[min(58vh,480px)] overflow-y-auto p-2.5">
          {!query.trim() ? (
            <p className="px-3 py-8 text-center text-[12px] text-muted">
              {t("search.hint")}
            </p>
          ) : results.length === 0 && showLoading ? (
            <div className="space-y-2.5 px-0.5 py-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[68px] animate-pulse rounded-2xl bg-[#e8eef6] dark:bg-white/5"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12px] text-muted">
              {t("search.empty", { query: debouncedQuery })}
            </p>
          ) : (
            <ul className="m-0 list-none space-y-2.5 p-0">
              <AnimatePresence mode="popLayout">
                {results.map((site, index) => (
                  <motion.li
                    key={site.id}
                    layout
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease, delay: reduce ? 0 : index * 0.04 }}
                  >
                    <SearchResultRow site={site} onView={setDetailSite} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>

      <SiteDetailModal
        site={detailSite}
        open={detailOpen}
        onClose={() => setDetailSite(null)}
      />
    </motion.div>
  );
}

export function PlacementSearchOverlay({ open, onClose }: PlacementSearchOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>{open ? <SearchPanel onClose={onClose} /> : null}</AnimatePresence>,
    document.body,
  );
}
