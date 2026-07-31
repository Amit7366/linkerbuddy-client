"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eye, Link2, X } from "lucide-react";
import {
  COUNTRY_FLAGS,
  domainInitials,
  formatTraffic,
  type SiteListing,
} from "@/config/landing";
import { useShortlist } from "@/providers/shortlist-provider";
import { useTranslations } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface SiteDetailModalProps {
  site: SiteListing | null;
  open: boolean;
  onClose: () => void;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-3.5 py-3">
      <small className="block text-[9px] tracking-[0.6px] text-muted uppercase">{label}</small>
      <b className="mt-1 block text-[15px] text-ink">{value}</b>
    </div>
  );
}

function SiteDetailPanel({ site, onClose }: { site: SiteListing; onClose: () => void }) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const titleId = useId();
  const { selectedIds, toggle } = useShortlist();
  const selected = selectedIds.includes(site.id);
  const flag = COUNTRY_FLAGS[site.country] ?? "🌐";

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
        aria-label={t("inventory.modal.close")}
        className="absolute inset-0 border-0 bg-[#071b3d]/55 backdrop-blur-xl dark:bg-[#02060f]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[22px] border border-line bg-card shadow-[0_30px_80px_#071b3d40] tablet:rounded-[22px] dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.32, ease }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-card/95 px-5 py-4 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eaf3ff] text-[13px] font-extrabold text-[#1268f3] dark:bg-[#1a2740] dark:text-brand">
              {domainInitials(site.domain)}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] tracking-[1px] text-muted uppercase">
                {t("inventory.modal.kicker")}
              </p>
              <h2 id={titleId} className="truncate text-[18px] font-bold text-ink">
                {site.domain}
              </h2>
              <p className="mt-0.5 text-[11px] text-muted">
                {flag} {site.country} · {site.niche}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("inventory.modal.close")}
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-sky"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-2 gap-2.5 tablet:grid-cols-4">
            <Metric label={t("inventory.modal.da")} value={String(site.da)} />
            <Metric label={t("inventory.modal.dr")} value={String(site.dr)} />
            <Metric label={t("inventory.modal.traffic")} value={formatTraffic(site.traffic)} />
            <Metric label={t("inventory.modal.tat")} value={site.tat} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#9fc0f0] bg-[#eaf3ff] px-3.5 py-3 dark:border-[#2a4570] dark:bg-[#15233a]">
              <small className="block text-[9px] tracking-[0.6px] text-[#1268f3] uppercase dark:text-[#7db4ff]">
                {t("inventory.modal.guestPost")}
              </small>
              <b className="mt-1 block text-[22px] text-[#1268f3] dark:text-brand">
                ${site.guest}
                <span className="ml-1 text-[11px] font-medium text-muted">/ post</span>
              </b>
            </div>
            <div className="rounded-xl border border-line bg-surface px-3.5 py-3">
              <small className="block text-[9px] tracking-[0.6px] text-muted uppercase">
                {t("inventory.modal.linkInsert")}
              </small>
              <b className="mt-1 block text-[22px] text-ink">
                ${site.insert}
                <span className="ml-1 text-[11px] font-medium text-muted">/ insert</span>
              </b>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold text-ink">
              <Eye className="size-4 text-brand" aria-hidden />
              {t("inventory.modal.details")}
            </div>
            <dl className="grid grid-cols-1 gap-2.5 text-[12px] tablet:grid-cols-2">
              <div className="flex justify-between gap-3 border-b border-line/70 pb-2">
                <dt className="text-muted">{t("inventory.modal.owner")}</dt>
                <dd className="font-semibold text-ink">{site.owner}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/70 pb-2">
                <dt className="text-muted">{t("inventory.modal.trend")}</dt>
                <dd className="font-semibold text-ink">{site.trend}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/70 pb-2">
                <dt className="text-muted">{t("inventory.modal.dofollow")}</dt>
                <dd className="font-semibold text-ink">{site.maxDofollow}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/70 pb-2">
                <dt className="text-muted">{t("inventory.modal.niche")}</dt>
                <dd className="font-semibold text-ink">{site.niche}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-2.5 tablet:flex-row">
            <Button
              className="flex-1"
              onClick={() => {
                toggle(site.id);
              }}
            >
              {selected ? t("marketplace.selected") : t("marketplace.addSite")}
            </Button>
            <a
              href={`https://${site.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-line bg-card px-4 py-2.5 text-[12px] font-bold text-ink transition-colors hover:bg-sky",
              )}
            >
              <Link2 className="size-3.5" aria-hidden />
              {t("inventory.modal.visit")}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SiteDetailModal({ site, open, onClose }: SiteDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && site ? <SiteDetailPanel site={site} onClose={onClose} /> : null}
    </AnimatePresence>,
    document.body,
  );
}
