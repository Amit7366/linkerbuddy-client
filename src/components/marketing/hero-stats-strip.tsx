"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/providers/locale-provider";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number | null, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (target === null || !active || started.current) return;
    started.current = true;

    if (reduce) {
      queueMicrotask(() => setValue(target));
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, reduce, target]);

  return value;
}

function StatValue({
  countTo,
  duration,
  fallback,
  suffix,
  active,
}: {
  countTo: number | null;
  duration: number;
  fallback: string;
  suffix: string;
  active: boolean;
}) {
  const counted = useCountUp(countTo, duration, active);
  const display = countTo === null ? fallback : String(counted);

  return (
    <strong className="text-[25px] tracking-[-1px] text-ink tabular-nums">
      {display}
      {suffix ? <sup className="text-sm text-brand">{suffix}</sup> : null}
    </strong>
  );
}

const STATS = [
  { key: "websites", value: "98", suffix: "", countTo: 98, duration: 1.6 },
  { key: "niches", value: "10", suffix: "+", countTo: 10, duration: 1.2 },
  { key: "tat", value: "Instant", suffix: "", countTo: null, duration: 0 },
  { key: "dofollow", value: "2", suffix: "", countTo: 2, duration: 1.0 },
] as const;

export function HeroStatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const t = useTranslations();

  return (
    <div
      ref={ref}
      className="relative z-[2] grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-card shadow-[var(--shadow-stats)] tablet:grid-cols-[repeat(4,1fr)_1.7fr]"
    >
      {STATS.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col gap-1 border-r border-line p-[15px] last:border-r-0 tablet:flex-row tablet:items-baseline tablet:gap-2.5 tablet:px-[23px] tablet:py-[19px]"
        >
          <StatValue
            countTo={stat.countTo}
            duration={stat.duration}
            fallback={stat.value}
            suffix={stat.suffix}
            active={inView}
          />
          <span className="text-[10px] text-muted">{t(`hero.stats.${stat.key}`)}</span>
        </div>
      ))}
      <div className="col-span-2 flex items-center gap-3 border-0 bg-sky p-[15px] tablet:col-span-1 tablet:px-[23px] tablet:py-[19px]">
        <span className="grid size-[34px] place-items-center rounded-full bg-[#d8f7eb] text-[15px] text-[#07845f] dark:bg-[#0f3d32] dark:text-[#34d399]">
          ✓
        </span>
        <div className="flex flex-col gap-0.5">
          <b className="text-[11px] text-ink">{t("hero.qualityTitle")}</b>
          <small className="text-[9px] text-muted">{t("hero.qualitySub")}</small>
        </div>
      </div>
    </div>
  );
}
