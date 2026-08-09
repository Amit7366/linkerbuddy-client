"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Box,
  FileCheck,
  FileText,
  Gauge,
  Link2,
  Package,
  PenLine,
  SearchCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "startup",
    features: [
      { key: "dr", icon: Gauge },
      { key: "content", icon: FileText },
      { key: "placement", icon: Link2 },
      { key: "indexation", icon: SearchCheck },
    ],
  },
  {
    id: "growth",
    features: [
      { key: "dr", icon: Gauge },
      { key: "content", icon: PenLine },
      { key: "placements", icon: Package },
      { key: "turnaround", icon: Zap },
    ],
  },
  {
    id: "enterprise",
    features: [
      { key: "dr", icon: Gauge },
      { key: "campaigns", icon: Link2 },
      { key: "content", icon: FileCheck },
      { key: "manager", icon: UserRound },
    ],
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

const DEFAULT_ACTIVE: PlanId = "growth";
function useTabletUp() {
  const [tabletUp, setTabletUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 61.25rem)");
    const update = () => setTabletUp(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return tabletUp;
}

function fillOrigins(planId: PlanId, tabletUp: boolean) {
  if (!tabletUp) {
    return { originX: 0.5, originY: 0 };
  }
  if (planId === "startup") return { originX: 0, originY: 0.5 };
  if (planId === "enterprise") return { originX: 1, originY: 0.5 };
  return { originX: 0.5, originY: 0.5 };
}

function FeatureIcon({
  icon: Icon,
  active,
}: {
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
        active ? "bg-white/15 text-white" : "bg-sky text-brand",
      )}
    >
      <Icon className="size-3 stroke-[2.5]" aria-hidden />
    </span>
  );
}

export function Pricing() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const tabletUp = useTabletUp();
  const [hoveredId, setHoveredId] = useState<PlanId | null>(null);
  const activeId = hoveredId ?? DEFAULT_ACTIVE;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-surface py-[90px]"
      aria-labelledby="pricing-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(120%_80%_at_50%_100%,color-mix(in_srgb,var(--blue)_10%,transparent),transparent_70%)] dark:bg-[radial-gradient(120%_80%_at_50%_100%,color-mix(in_srgb,var(--blue)_18%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-18%] h-[55%] rounded-[100%] bg-[color-mix(in_srgb,var(--line)_55%,transparent)] dark:bg-[color-mix(in_srgb,var(--blue)_12%,transparent)]"
        aria-hidden
      />

      <Container className="relative z-[1]">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="pricing-heading"
            className="m-0 text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-1.5px] text-ink"
          >
            {t("pricing.title")}
          </h2>
          <p className="mx-auto mt-3 mb-0 max-w-xl text-[15px] leading-relaxed text-muted">
            {t("pricing.subtitle")}
          </p>
        </Reveal>

        <div
          className="mx-auto max-w-5xl"
          onMouseLeave={() => setHoveredId(null)}
        >
          <Stagger className="grid gap-5 tablet:grid-cols-3 tablet:items-stretch tablet:gap-6">
            {PLANS.map((plan) => {
              const planId = plan.id as PlanId;
              const active = activeId === planId;
              const origins = fillOrigins(planId, tabletUp);

              return (
                <StaggerItem key={plan.id} className="h-full">
                  <article
                    onMouseEnter={() => setHoveredId(planId)}
                    onFocusCapture={() => setHoveredId(planId)}
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-[22px] p-7 transition-[transform,box-shadow,border-color] duration-300",
                      active
                        ? "z-[2] border border-transparent text-white shadow-[0_24px_60px_#1268f355] tablet:scale-[1.03]"
                        : "z-[1] border border-line bg-card text-ink shadow-[0_18px_50px_#12325b14] dark:shadow-[0_18px_50px_#00000040]",
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[22px] bg-brand"
                      initial={false}
                      animate={
                        tabletUp
                          ? {
                              scaleX: active ? 1 : 0,
                              scaleY: 1,
                            }
                          : {
                              scaleX: 1,
                              scaleY: active ? 1 : 0,
                            }
                      }
                      style={{
                        originX: origins.originX,
                        originY: origins.originY,
                      }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 220,
                              damping: 28,
                              mass: 0.85,
                            }
                      }
                    />

                    <div className="relative z-[1] flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-xl transition-colors duration-300",
                          active ? "bg-white/15 text-white" : "bg-sky text-brand",
                        )}
                      >
                        <Box className="size-5" aria-hidden />
                      </span>
                      <h3 className="m-0 text-[18px] font-bold">
                        {t(`pricing.plans.${planId}.name`)}
                      </h3>
                    </div>

                    <p
                      className={cn(
                        "relative z-[1] mt-5 mb-0 min-h-[48px] text-[13px] leading-relaxed transition-colors duration-300",
                        active ? "text-white/85" : "text-muted",
                      )}
                    >
                      {t(`pricing.plans.${planId}.description`)}
                    </p>

                    <div
                      className={cn(
                        "relative z-[1] my-6 h-px w-full transition-colors duration-300",
                        active ? "bg-white/25" : "bg-line",
                      )}
                    />

                    <ul className="relative z-[1] m-0 flex list-none flex-col gap-3.5 p-0">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.key}
                          className="flex items-start gap-2.5 text-[13px]"
                        >
                          <FeatureIcon icon={feature.icon} active={active} />
                          <span>
                            {t(`pricing.plans.${planId}.features.${feature.key}`)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative z-[1] mt-auto pt-8">
                      <a
                        href={
                          planId === "enterprise"
                            ? "#custom-list"
                            : "#marketplace"
                        }
                        className={cn(
                          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold no-underline transition-[transform,background-color,color,box-shadow] duration-300 hover:-translate-y-0.5",
                          active
                            ? "bg-white text-brand shadow-[0_8px_24px_#00000022]"
                            : "bg-brand text-white shadow-[var(--shadow-btn)]",
                        )}
                      >
                        {t(`pricing.plans.${planId}.cta`)}
                        <ArrowRight className="size-4" aria-hidden />
                      </a>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <a
            href="#faq"
            className="inline-flex items-center justify-center rounded-full border border-line bg-card px-5 py-2.5 text-[13px] font-semibold text-ink no-underline shadow-sm transition-colors hover:border-brand/30 hover:bg-sky"
          >
            {t("pricing.compare")}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
