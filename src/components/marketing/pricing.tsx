"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "single",
    features: ["guest", "insertion", "grey", "tat", "links", "quality"] as const,
  },
  {
    id: "growth",
    features: ["posts", "mix", "dr", "tat", "indexing", "dashboard"] as const,
  },
  {
    id: "agency",
    features: ["posts", "mix", "traffic", "tat", "manager", "shortlist"] as const,
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

const TERM_KEYS = [
  "quality",
  "links",
  "payment",
  "guarantees",
  "sponsored",
  "prohibited",
] as const;

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
  if (planId === "single") return { originX: 0, originY: 0.5 };
  if (planId === "agency") return { originX: 1, originY: 0.5 };
  return { originX: 0.5, originY: 0.5 };
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
      className="relative overflow-hidden bg-surface py-16 tablet:py-[90px]"
      aria-labelledby="pricing-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(120%_80%_at_50%_100%,color-mix(in_srgb,#483EF4_10%,transparent),transparent_70%)] dark:bg-[radial-gradient(120%_80%_at_50%_100%,color-mix(in_srgb,#483EF4_18%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-18%] h-[55%] rounded-[100%] bg-[color-mix(in_srgb,var(--line)_55%,transparent)] dark:bg-[color-mix(in_srgb,#483EF4_12%,transparent)]"
        aria-hidden
      />

      <Container className="relative z-[1]">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
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

        <Reveal delay={0.05} className="mx-auto mb-10 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,#f59e0b_35%,var(--line))] bg-[color-mix(in_srgb,#fef3c7_70%,var(--card))] dark:bg-[color-mix(in_srgb,#78350f_28%,var(--card))]">
            <div className="border-b border-[color-mix(in_srgb,#f59e0b_40%,transparent)] bg-[color-mix(in_srgb,#f59e0b_12%,transparent)] px-5 py-3 tablet:px-6">
              <p className="m-0 text-[15px] font-bold text-ink">
                {t("pricing.rateCard.title")}
              </p>
              <p className="m-0 mt-0.5 text-[12px] text-muted">
                {t("pricing.rateCard.note")}
              </p>
            </div>
            <div className="grid gap-4 px-5 py-5 tablet:grid-cols-2 tablet:gap-5 tablet:px-6 laptop:grid-cols-4">
              <div>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-muted">
                  {t("pricing.rateCard.guest")}
                </p>
                <p className="m-0 mt-1 text-[22px] font-bold tracking-tight text-[#483EF4]">
                  {t("pricing.rateCard.guestPrice")}
                </p>
              </div>
              <div>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-muted">
                  {t("pricing.rateCard.grey")}
                </p>
                <p className="m-0 mt-1 text-[22px] font-bold tracking-tight text-[#483EF4]">
                  {t("pricing.rateCard.greyPrice")}
                </p>
              </div>
              <div>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-muted">
                  {t("pricing.rateCard.insertion")}
                </p>
                <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-ink">
                  {t("pricing.rateCard.insertionGeneral")}
                  <br />
                  {t("pricing.rateCard.insertionGrey")}
                </p>
              </div>
              <div>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-muted">
                  {t("pricing.rateCard.tat")}
                </p>
                <p className="m-0 mt-1 text-[13px] font-semibold leading-snug text-ink">
                  {t("pricing.rateCard.tatValue")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,#f59e0b_25%,transparent)] px-5 py-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
              <p className="m-0 text-[13px] leading-relaxed text-muted">
                {t("pricing.rateCard.sitesNote")}
              </p>
              <a
                href="#marketplace"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#483EF4] px-4 py-2.5 text-[13px] font-bold text-white no-underline shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                {t("pricing.rateCard.dashboardCta")}
              </a>
            </div>
          </div>
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
              const isPopular = planId === "growth";

              return (
                <StaggerItem key={plan.id} className="h-full">
                  <article
                    onMouseEnter={() => setHoveredId(planId)}
                    onFocusCapture={() => setHoveredId(planId)}
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-[22px] p-7 transition-[transform,box-shadow,border-color] duration-300",
                      active
                        ? "z-[2] border border-transparent text-white shadow-[0_24px_60px_color-mix(in_srgb,#483EF4_33%,transparent)] tablet:scale-[1.03]"
                        : "z-[1] border border-line bg-card text-ink shadow-[var(--shadow-product)]",
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[22px] bg-[#483EF4]"
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

                    <div className="relative z-[1] flex items-center gap-2.5">
                      <h3 className="m-0 text-[18px] font-bold">
                        {t(`pricing.plans.${planId}.name`)}
                      </h3>
                      {isPopular ? (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#483EF4] text-white",
                          )}
                        >
                          {t("pricing.popular")}
                        </span>
                      ) : null}
                    </div>

                    <div className="relative z-[1] mt-5 flex items-baseline gap-1.5">
                      <span className="text-[clamp(2rem,3.5vw,2.5rem)] font-bold tracking-[-1px] leading-none">
                        {t(`pricing.plans.${planId}.price`)}
                      </span>
                      <span
                        className={cn(
                          "text-[14px] font-semibold",
                          active ? "text-white/80" : "text-muted",
                        )}
                      >
                        {t(`pricing.plans.${planId}.unit`)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "relative z-[1] mt-2 mb-0 text-[13px] font-semibold leading-relaxed transition-colors duration-300",
                        active ? "text-white/85" : "text-[color-mix(in_srgb,#483EF4_85%,#0f766e)]",
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
                      {plan.features.map((featureKey) => (
                        <li
                          key={featureKey}
                          className="flex items-start gap-2.5 text-[13px]"
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
                              active
                                ? "bg-white/15 text-white"
                                : "bg-[color-mix(in_srgb,#22c55e_15%,var(--card))] text-[#16a34a]",
                            )}
                          >
                            <Check className="size-3 stroke-[2.5]" aria-hidden />
                          </span>
                          <span>
                            {t(
                              `pricing.plans.${planId}.features.${featureKey}`,
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative z-[1] mt-auto pt-8">
                      <a
                        href={
                          planId === "agency" ? "#custom-list" : "#marketplace"
                        }
                        className={cn(
                          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold no-underline transition-[transform,background-color,color,box-shadow] duration-300 hover:-translate-y-0.5",
                          active
                            ? "bg-white text-[#483EF4] shadow-[0_8px_24px_#00000022]"
                            : "bg-[#483EF4] text-white shadow-[var(--shadow-btn)]",
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

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-5xl">
          <div
            id="pricing-terms"
            className="rounded-2xl border border-line border-l-[4px] border-l-[#483EF4] bg-[color-mix(in_srgb,#483EF4_8%,var(--card))] px-5 py-5 tablet:px-6 dark:bg-[color-mix(in_srgb,#483EF4_12%,var(--card))]"
          >
            <h3 className="m-0 mb-3 text-[15px] font-bold text-ink">
              {t("pricing.terms.title")}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {TERM_KEYS.map((key) => (
                <li
                  key={key}
                  className="text-[13px] leading-relaxed text-muted"
                >
                  {t(`pricing.terms.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 text-center">
          <a
            href="#pricing-terms"
            className="inline-flex items-center justify-center rounded-full border border-line bg-card px-5 py-2.5 text-[13px] font-semibold text-ink no-underline shadow-sm transition-colors hover:border-[#483EF4]/30 hover:bg-[#483EF4]/8"
          >
            {t("pricing.compare")}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
