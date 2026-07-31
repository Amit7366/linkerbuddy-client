"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsomorphicLayoutReady } from "@/hooks/use-isomorphic-layout-ready";
import { useMarketplaceStats } from "@/hooks/use-marketplace-stats";
import { useTranslations } from "@/providers/locale-provider";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number | undefined, duration: number, active: boolean) {
  const [value, setValue] = useState<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (target === undefined || !active) {
      setValue(null);
      return;
    }

    if (reduce) {
      setValue(target);
      return;
    }

    let frame = 0;
    let cancelled = false;
    const start = performance.now();
    setValue(0);

    const tick = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const next = Math.round(easeOutCubic(progress) * target);
      setValue(progress < 1 ? next : target);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [active, duration, reduce, target]);

  return value;
}

function StatValue({
  countTo,
  duration,
  suffix,
  active,
  ready,
}: {
  countTo: number | undefined;
  duration: number;
  suffix: string;
  active: boolean;
  ready: boolean;
}) {
  const counted = useCountUp(ready ? countTo : undefined, duration, active && ready);

  if (!ready || countTo === undefined || counted === null) {
    return <Skeleton className="h-7 w-12 rounded-md" />;
  }

  return (
    <strong className="text-[25px] tracking-[-1px] text-ink tabular-nums">
      {counted}
      {suffix ? <sup className="text-sm text-brand">{suffix}</sup> : null}
    </strong>
  );
}

export function HeroStatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35, margin: "0px 0px -40px 0px" });
  const t = useTranslations();
  const layoutReady = useIsomorphicLayoutReady();
  const { data, isPending, isError, isSuccess, refetch, isFetching } = useMarketplaceStats();

  const ready = layoutReady && isSuccess && Boolean(data);
  const showError = layoutReady && isError;

  const stats = [
    {
      key: "websites" as const,
      countTo: data?.total,
      suffix: "",
      duration: 1.6,
      staticValue: null as string | null,
    },
    {
      key: "niches" as const,
      countTo: data?.countries,
      suffix: "+",
      duration: 1.2,
      staticValue: null as string | null,
    },
    {
      key: "tat" as const,
      countTo: undefined,
      suffix: "",
      duration: 0,
      staticValue: "Instant",
    },
    {
      key: "dofollow" as const,
      countTo: data?.maxDofollow,
      suffix: "",
      duration: 1.0,
      staticValue: null as string | null,
    },
  ];

  return (
    <div
      ref={ref}
      className="relative z-[2] overflow-hidden rounded-[14px] border border-line bg-card shadow-[var(--shadow-stats)]"
      aria-busy={!layoutReady || isPending || isFetching}
      aria-live="polite"
    >
      {showError ? (
        <div className="flex flex-col items-start justify-between gap-3 p-[18px] tablet:flex-row tablet:items-center">
          <p className="m-0 text-[13px] text-muted">{t("hero.stats.error")}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="cursor-pointer rounded-lg border border-line bg-sky px-3 py-2 text-[11px] font-bold text-brand hover:bg-brand hover:text-white"
          >
            {t("hero.stats.retry")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 tablet:grid-cols-[repeat(4,1fr)_1.7fr]">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex flex-col gap-1 border-r border-line p-[15px] last:border-r-0 tablet:flex-row tablet:items-baseline tablet:gap-2.5 tablet:px-[23px] tablet:py-[19px]"
            >
              {stat.staticValue ? (
                <strong className="text-[25px] tracking-[-1px] text-ink">{stat.staticValue}</strong>
              ) : (
                <StatValue
                  countTo={stat.countTo}
                  duration={stat.duration}
                  suffix={stat.suffix}
                  active={inView}
                  ready={ready}
                />
              )}
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
      )}
      <span className="sr-only">{!layoutReady || isPending ? t("hero.stats.loading") : null}</span>
    </div>
  );
}
