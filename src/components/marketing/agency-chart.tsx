"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { AGENCY_CHART_BARS, AGENCY_METRICS } from "@/config/landing";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const METRIC_KEYS = ["live", "tat", "ontime"] as const;

export function AgencyChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const t = useTranslations();

  return (
    <div className="mt-4 rounded-2xl bg-card p-[22px] text-ink shadow-[var(--shadow-agency)] tablet:mt-0">
      <div className="flex justify-between text-[11px]">
        <span>{t("agency.overview")}</span>
        <b className="text-muted">{t("agency.month")}</b>
      </div>

      <div
        ref={ref}
        className="relative mt-[22px] flex h-[180px] items-end gap-[13px] border-b border-line px-2.5"
        onMouseLeave={() => setHovered(null)}
      >
        {AGENCY_CHART_BARS.map((bar, index) => {
          const isActive = hovered === index;

          return (
            <div
              key={bar.label}
              className="relative flex h-full flex-1 items-end"
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
            >
              <motion.button
                type="button"
                aria-label={`${bar.label}: ${bar.value} ${bar.unit}. ${bar.hint}`}
                className={cn(
                  "relative w-full cursor-pointer rounded-t-md border-0 bg-[linear-gradient(#2f83f6,#b7d5ff)] p-0 outline-none transition-[filter] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  isActive && "brightness-110",
                )}
                initial={reduce ? false : { height: 0, opacity: 0.5 }}
                animate={
                  inView
                    ? { height: `${bar.height}%`, opacity: 1 }
                    : { height: 0, opacity: 0.5 }
                }
                transition={{
                  duration: reduce ? 0 : 0.7,
                  ease,
                  delay: reduce ? 0 : 0.08 * index,
                }}
                whileHover={reduce ? undefined : { scaleY: 1.04, originY: 1 }}
              />

              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    role="tooltip"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease }}
                    className={cn(
                      "pointer-events-none absolute bottom-[calc(100%+10px)] z-20 w-[168px] rounded-[10px] border border-[#dbe5f1] bg-white p-2.5 text-left shadow-[0_14px_34px_#12335d26]",
                      index < 2
                        ? "left-0"
                        : index > AGENCY_CHART_BARS.length - 3
                          ? "right-0"
                          : "left-1/2 -translate-x-1/2",
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-ink">{bar.label}</span>
                      <span className="rounded-md bg-[#eaf3ff] px-1.5 py-0.5 text-[9px] font-bold text-brand">
                        {bar.value} {bar.unit}
                      </span>
                    </div>
                    <p className="m-0 text-[9px] leading-relaxed text-[#6a778c]">{bar.hint}</p>
                    <span
                      className={cn(
                        "absolute -bottom-1.5 size-2.5 rotate-45 border-r border-b border-[#dbe5f1] bg-white",
                        index < 2
                          ? "left-4"
                          : index > AGENCY_CHART_BARS.length - 3
                            ? "right-4"
                            : "left-1/2 -translate-x-1/2",
                      )}
                      aria-hidden
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-[18px] grid grid-cols-3 gap-3">
        {AGENCY_METRICS.map((metric, index) => (
          <div key={metric.label} className="flex flex-col">
            <small className="text-[8px] text-muted">
              {t(`agency.metrics.${METRIC_KEYS[index]}`)}
            </small>
            <b className="mt-1 text-[17px]">{metric.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
