"use client";

import { useState } from "react";
import { Check, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HERO_PREVIEW_ROWS } from "@/config/landing";
import { PlacementSearchOverlay } from "@/components/marketing/placement-search-overlay";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroProductPreview() {
  const reduce = useReducedMotion();
  const t = useTranslations();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <motion.div
        className="relative rounded-[18px] border border-line bg-card p-[13px] shadow-[var(--shadow-product)] tablet:rotate-[1deg] tablet:p-5"
        aria-label="Marketplace preview"
        initial={reduce ? false : { opacity: 0, y: 36, scale: 0.94, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.15 }}
      >
        <motion.div
          className="mb-[18px] flex items-center justify-between"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.35 }}
        >
          <div className="flex flex-col gap-0.5">
            <small className="text-[8px] tracking-[1.2px] text-muted uppercase">
              {t("hero.campaignBuilder")}
            </small>
            <strong className="text-[15px] text-ink">{t("hero.indiaAuthority")}</strong>
          </div>
          <motion.span
            className="rounded-[30px] bg-[#e7fbf4] px-2.5 py-1.5 text-[9px] font-bold text-[#087b5a] dark:bg-[#0f3d32] dark:text-[#34d399]"
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    boxShadow: [
                      "0 0 0 0 rgba(8, 123, 90, 0)",
                      "0 0 0 6px rgba(8, 123, 90, 0.12)",
                      "0 0 0 0 rgba(8, 123, 90, 0)",
                    ],
                  }
            }
            transition={
              reduce
                ? { duration: 0.35, delay: 0.45 }
                : {
                    opacity: { duration: 0.35, delay: 0.45 },
                    scale: { duration: 0.35, delay: 0.45 },
                    boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  }
            }
          >
            ● {t("hero.liveInventory")}
          </motion.span>
        </motion.div>

        <motion.button
          type="button"
          aria-label={t("search.openSearch")}
          onClick={() => setSearchOpen(true)}
          className="mb-2.5 flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[9px] border border-line bg-surface px-3 py-3 text-left text-[11px] text-muted transition-colors hover:border-brand/40 hover:bg-sky"
          initial={reduce ? false : { opacity: 0, y: 14, scaleX: 0.92 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: 0.5, ease, delay: 0.48 }}
          style={{ originX: 0 }}
        >
          <motion.span
            initial={reduce ? false : { opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.35, delay: 0.62 }}
          >
            <Search className="size-3.5 shrink-0" aria-hidden />
          </motion.span>
          <motion.span
            className="inline-block overflow-hidden whitespace-nowrap"
            initial={reduce ? false : { width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
          >
            {t("hero.searchPlaceholder")}
          </motion.span>
          {!reduce ? (
            <motion.span
              className="ml-0.5 inline-block h-3 w-px bg-muted"
              aria-hidden
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </motion.button>

        {HERO_PREVIEW_ROWS.map((row, index) => (
          <motion.div
            key={row.domain}
            className={cn(
              "my-2 grid grid-cols-[32px_minmax(0,1.5fr)_0.5fr_0.55fr_24px] items-center gap-2 rounded-[10px] border border-line px-2.5 py-2.5 tablet:grid-cols-[34px_minmax(0,1.7fr)_0.5fr_0.7fr_0.55fr_26px] tablet:gap-2.5",
              row.featured && "border-[#9fc2fa] bg-sky",
            )}
            initial={reduce ? false : { opacity: 0, x: 24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.82 + index * 0.14 }}
            whileHover={reduce ? undefined : { y: -2, transition: { duration: 0.2 } }}
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg text-[10px] font-extrabold",
                row.purple ? "bg-[#efe9ff] text-[#714bd1]" : "bg-[#e4f0ff] text-[#1d68d6]",
              )}
            >
              {row.initials}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <b className="truncate text-[10px] text-ink">{row.domain}</b>
              <small className="text-[8px] text-muted">{row.meta}</small>
            </div>
            <div className="flex flex-col">
              <small className="text-[8px] text-muted">DR</small>
              <b className="text-[11px] text-ink">{row.dr}</b>
            </div>
            <div className="hidden flex-col tablet:flex">
              <small className="text-[8px] text-muted">Traffic</small>
              <b className="text-[11px] text-ink">{row.traffic}</b>
            </div>
            <strong className="text-xs text-ink">{row.price}+</strong>
            <motion.span
              className="grid size-6 place-items-center rounded-md bg-brand text-xs font-bold text-white"
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 1 + index * 0.14 }}
            >
              +
            </motion.span>
          </motion.div>
        ))}

        <motion.div
          className="mt-3.5 flex items-center justify-between rounded-[10px] bg-navy px-3 py-2.5 text-[9px] text-white"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 1.15 }}
        >
          <span className="hidden flex-col text-[#b7c5da] tablet:flex">
            <span>{t("hero.sitesSelected")}</span>
          </span>
          <span className="flex flex-col text-[#b7c5da]">
            {t("hero.estimatedTotal")} <b className="text-[11px] text-white">$155</b>
          </span>
          <button
            type="button"
            className="rounded-md border-0 bg-brand px-2.5 py-2 text-[9px] font-bold text-white"
          >
            {t("hero.continue")}
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 -left-[50px] z-10 hidden items-center gap-2.5 rounded-[10px] border border-line bg-card px-4 py-2.5 tablet:flex"
        style={{ rotate: -1 }}
        initial={reduce ? false : { opacity: 0, x: -28, y: 18, scale: 0.9 }}
        animate={
          reduce
            ? { opacity: 1, x: 0, y: 0, scale: 1 }
            : {
                opacity: 1,
                x: 0,
                y: [0, -10, 0],
                scale: 1,
                boxShadow: [
                  "0 12px 28px #12335d1f",
                  "0 22px 40px #12335d33",
                  "0 12px 28px #12335d1f",
                ],
              }
        }
        transition={
          reduce
            ? { duration: 0.4, delay: 1.2 }
            : {
                opacity: { duration: 0.5, ease, delay: 1.25 },
                x: { duration: 0.5, ease, delay: 1.25 },
                scale: { duration: 0.5, ease, delay: 1.25 },
                y: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
                boxShadow: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
              }
        }
      >
        <motion.span
          className="grid size-7 place-items-center rounded-full bg-[#e7fbf4] dark:bg-[#0f3d32]"
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Check className="size-4 text-green" aria-hidden />
        </motion.span>
        <div className="flex flex-col">
          <small className="text-[8px] text-muted">{t("hero.trafficChecked")}</small>
          <b className="text-[10px] text-ink">{t("hero.trafficDate")}</b>
        </div>
      </motion.div>

      <PlacementSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
