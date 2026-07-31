"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, X, RefreshCw, CheckCircle2, Lightbulb } from "lucide-react";
import {
  COUNTRY_FLAGS,
  domainInitials,
  formatTraffic,
  type SiteListing,
} from "@/config/landing";
import type { CtaAnalyzeResult } from "@/types/cta-analyze";
import { useShortlist } from "@/providers/shortlist-provider";
import { useTranslations } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const LOADING_STEPS = [
  "cta.modal.stepInventory",
  "cta.modal.stepAnalyze",
  "cta.modal.stepRank",
] as const;

export type CtaBrief = {
  niche: string;
  budget: string;
  email: string;
};

interface CtaAiModalProps {
  open: boolean;
  brief: CtaBrief | null;
  onClose: () => void;
}

function ListingSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="h-3 w-[80%]" />
        </div>
        <Skeleton className="h-7 w-14 rounded-lg" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({
  site,
  fitScore,
  reason,
}: {
  site: SiteListing;
  fitScore: number;
  reason: string;
}) {
  const t = useTranslations();
  const { selectedIds, toggle } = useShortlist();
  const selected = selectedIds.includes(site.id);
  const flag = COUNTRY_FLAGS[site.country] ?? "🌐";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-line bg-surface p-4"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf3ff] text-[12px] font-extrabold text-[#1268f3] dark:bg-[#1a2740] dark:text-brand">
          {domainInitials(site.domain)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-ink">{site.domain}</h3>
            <span className="rounded-md bg-[#1268f3]/12 px-2 py-0.5 text-[10px] font-bold text-[#1268f3] dark:bg-brand/20 dark:text-brand">
              {fitScore}% {t("cta.modal.fit")}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted">
            {flag} {site.country} · {site.niche}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-ink/80">{reason}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {[
          { label: "DR", value: String(site.dr) },
          { label: "DA", value: String(site.da) },
          { label: "Traffic", value: formatTraffic(site.traffic) },
          { label: "Guest", value: `$${site.guest}` },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-line bg-card px-2 py-2">
            <small className="block text-[9px] tracking-[0.5px] text-muted uppercase">
              {metric.label}
            </small>
            <b className="mt-0.5 block text-[13px] text-ink">{metric.value}</b>
          </div>
        ))}
      </div>

      <Button
        className="mt-3 w-full"
        variant={selected ? "ghost" : "primary"}
        onClick={() => toggle(site.id)}
      >
        {selected ? t("marketplace.selected") : t("marketplace.addSite")}
      </Button>
    </motion.article>
  );
}

function ModalBody({
  brief,
  onClose,
}: {
  brief: CtaBrief;
  onClose: () => void;
}) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const titleId = useId();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [result, setResult] = useState<CtaAnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setStatus("loading");
      setError(null);
      setResult(null);
      setStepIndex(0);

      try {
        const response = await fetch("/api/cta/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brief),
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          success?: boolean;
          error?: string;
          data?: CtaAnalyzeResult;
        };

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || t("cta.modal.error"));
        }

        if (!cancelled) {
          setResult(payload.data);
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : t("cta.modal.error"));
        setStatus("error");
      }
    }

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [brief, retryToken, t]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 tablet:items-center tablet:p-4"
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
        aria-label={t("cta.modal.close")}
        className="absolute inset-0 border-0 bg-[#071b3d]/55 backdrop-blur-xl dark:bg-[#02060f]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-[22px] border border-line bg-card shadow-[0_30px_80px_#071b3d40] tablet:rounded-[22px] dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.32, ease }}
      >
        <div className="sticky top-0 z-10 border-b border-line bg-card/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] tracking-[1px] text-muted uppercase">
                <Sparkles className="size-3.5 text-brand" aria-hidden />
                {t("cta.modal.kicker")}
              </p>
              <h2 id={titleId} className="mt-1 text-[18px] font-bold text-ink">
                {status === "loading" ? t("cta.modal.loadingTitle") : t("cta.modal.title")}
              </h2>
              <p className="mt-1 text-[12px] text-muted">
                {brief.niche} · {brief.budget} · {brief.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("cta.modal.close")}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-sky"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {status === "loading" ? (
            <div className="space-y-4" aria-busy="true" aria-live="polite">
              <div className="rounded-2xl border border-[#9fc0f0] bg-[#eaf3ff] p-4 dark:border-[#2a4570] dark:bg-[#15233a]">
                <div className="flex items-center gap-3">
                  <span className="relative grid size-10 place-items-center rounded-full bg-white/70 dark:bg-[#0d1a2e]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#1268f3]/25" />
                    <Sparkles className="relative size-4 text-[#1268f3] dark:text-brand" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{t(LOADING_STEPS[stepIndex])}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{t("cta.modal.loadingHint")}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1.5">
                  {LOADING_STEPS.map((step, index) => (
                    <span
                      key={step}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        index <= stepIndex ? "bg-[#1268f3]" : "bg-[#1268f3]/20 dark:bg-brand/20",
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[84%]" />
              </div>

              {Array.from({ length: 3 }).map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="text-[15px] font-bold text-ink">{t("cta.modal.errorTitle")}</p>
              <p className="mt-2 text-[13px] text-muted">{error ?? t("cta.modal.error")}</p>
              <Button className="mt-4" onClick={() => setRetryToken((n) => n + 1)}>
                <RefreshCw className="mr-2 size-3.5" aria-hidden />
                {t("cta.modal.retry")}
              </Button>
            </div>
          ) : null}

          {status === "ready" && result ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#9fc0f0] bg-[#eaf3ff] p-4 dark:border-[#2a4570] dark:bg-[#15233a]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#1268f3] dark:text-brand" />
                  <div>
                    <p className="text-[13px] font-bold text-ink">{result.summary}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink/75">{result.strategy}</p>
                  </div>
                </div>
              </div>

              {result.tips.length > 0 ? (
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-ink">
                    <Lightbulb className="size-3.5 text-brand" aria-hidden />
                    {t("cta.modal.tips")}
                  </p>
                  <ul className="space-y-1.5">
                    {result.tips.map((tip) => (
                      <li key={tip} className="text-[12px] leading-relaxed text-muted">
                        · {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <p className="mb-3 text-[12px] font-bold tracking-[0.4px] text-muted uppercase">
                  {t("cta.modal.picks", { count: result.recommendations.length })}
                </p>
                <div className="space-y-3">
                  {result.recommendations.map((item) => (
                    <RecommendationCard
                      key={item.siteId}
                      site={item.site}
                      fitScore={item.fitScore}
                      reason={item.reason}
                    />
                  ))}
                </div>
              </div>

              {result.recommendations.length === 0 ? (
                <p className="text-center text-[13px] text-muted">{t("cta.modal.empty")}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        {status === "ready" ? (
          <div className="border-t border-line bg-card px-5 py-4">
            <Button className="w-full" onClick={onClose}>
              {t("cta.modal.done")}
            </Button>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

export function CtaAiModal({ open, brief, onClose }: CtaAiModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && brief ? <ModalBody brief={brief} onClose={onClose} /> : null}
    </AnimatePresence>,
    document.body,
  );
}
