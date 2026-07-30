"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { SITE_LISTINGS, formatTraffic, domainInitials } from "@/config/landing";
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

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];

    return SITE_LISTINGS.filter((site) => {
      return (
        site.domain.toLowerCase().includes(q) ||
        site.niche.toLowerCase().includes(q) ||
        String(site.dr).includes(q) ||
        String(site.guest).includes(q) ||
        site.owner.toLowerCase().includes(q) ||
        site.trend.toLowerCase().includes(q)
      );
    }).slice(0, 8);
  }, [debouncedQuery]);

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
        className="relative z-10 w-full max-w-[720px] overflow-hidden rounded-2xl border border-white/30 bg-white/75 shadow-[0_30px_80px_#071b3d40] backdrop-blur-2xl dark:border-white/10 dark:bg-[#121a2b]/80 dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease }}
      >
        <div className="flex items-center gap-3 border-b border-line/70 px-4 py-3.5 dark:border-white/10">
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
              className="w-full border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-2">
            {searching ? <LoadingDots /> : null}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("search.close")}
              className="grid size-9 place-items-center rounded-xl border border-line bg-card/80 text-ink transition-colors hover:bg-sky dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="max-h-[min(58vh,420px)] overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="px-3 py-8 text-center text-[12px] text-muted">{t("search.hint")}</p>
          ) : results.length === 0 && searching ? (
            <div className="space-y-2 px-2 py-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-line/50 dark:bg-white/5"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12px] text-muted">
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
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-3 text-left transition-colors hover:bg-sky/80 dark:hover:bg-white/8"
                      onClick={() => {
                        onClose();
                        document
                          .querySelector("#marketplace")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky text-[11px] font-extrabold text-brand dark:bg-[#1a2740]">
                        {domainInitials(site.domain)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold text-ink">
                          {site.domain}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted">
                          {site.niche} · DR {site.dr} · {formatTraffic(site.traffic)} · $
                          {site.guest}
                        </span>
                      </span>
                      <span className="rounded-lg bg-brand/10 px-2 py-1 text-[10px] font-bold text-brand">
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
