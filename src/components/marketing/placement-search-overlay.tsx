"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { formatTraffic, domainInitials } from "@/config/landing";
import { listMarketplace } from "@/lib/api/marketplace";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTranslations } from "@/providers/locale-provider";
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

function SearchPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 320);
  const searching = query.trim().length > 0 && query !== debouncedQuery;
  const [results, setResults] = useState<
    Array<{
      id: number;
      domain: string;
      niche: string;
      da: number;
      dr: number;
      traffic: number;
      guest: number;
      owner: string;
    }>
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

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
        className="absolute inset-0 border-0 bg-[#071b3d]/55 backdrop-blur-xl dark:bg-[#02060f]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-[720px] overflow-hidden rounded-2xl border border-[#d6e3f5] bg-white shadow-[0_30px_80px_#071b3d40] backdrop-blur-2xl dark:border-white/10 dark:bg-[#121a2b]/95 dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease }}
      >
        <div className="flex items-center gap-3 border-b border-[#dfe6f0] px-4 py-3.5 dark:border-white/10">
          <Search className="size-5 shrink-0 text-[#1268f3] dark:text-brand" aria-hidden />
          <div className="min-w-0 flex-1">
            <p id={titleId} className="sr-only">
              {t("search.title")}
            </p>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full border-0 bg-transparent text-[15px] font-medium text-[#0b1830] outline-none placeholder:text-[#63708a] dark:text-ink dark:placeholder:text-muted"
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
              className="grid size-9 place-items-center rounded-xl border border-[#dfe6f0] bg-[#f7f9fc] text-[#0b1830] transition-colors hover:bg-[#eaf3ff] dark:border-white/10 dark:bg-white/5 dark:text-ink dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="max-h-[min(58vh,420px)] overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="px-3 py-8 text-center text-[12px] text-[#63708a] dark:text-muted">
              {t("search.hint")}
            </p>
          ) : results.length === 0 && showLoading ? (
            <div className="space-y-2 px-2 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-[#e8eef6] dark:bg-white/5"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12px] text-[#63708a] dark:text-muted">
              {t("search.empty", { query: debouncedQuery })}
            </p>
          ) : (
            <ul className="m-0 list-none space-y-1 p-0">
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
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-3 text-left transition-colors hover:bg-[#eaf3ff] dark:hover:bg-white/8"
                      onClick={() => {
                        onClose();
                        document
                          .querySelector("#marketplace")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf3ff] text-[11px] font-extrabold text-[#1268f3] dark:bg-[#1a2740] dark:text-brand">
                        {domainInitials(site.domain)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold text-[#1268f3] dark:text-brand">
                          {site.domain}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-[#5a6880] dark:text-muted">
                          {site.niche} · DR {site.dr} · {formatTraffic(site.traffic)} · $
                          {site.guest}
                        </span>
                      </span>
                      <span className="rounded-lg bg-[#eaf3ff] px-2 py-1 text-[10px] font-bold text-[#1268f3] dark:bg-brand/10 dark:text-brand">
                        {site.owner}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>
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
