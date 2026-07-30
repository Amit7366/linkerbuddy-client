"use client";

import { ArrowRight, Box, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "startup",
    price: "99",
    featured: false,
    featureKeys: ["users", "pages", "domains", "support"] as const,
  },
  {
    id: "growth",
    price: "149",
    featured: true,
    featureKeys: ["users", "pages", "domains", "support"] as const,
  },
  {
    id: "enterprise",
    price: "399",
    featured: false,
    featureKeys: ["users", "pages", "domains", "support"] as const,
  },
] as const;

export function Pricing() {
  const t = useTranslations();

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

        <Stagger className="mx-auto grid max-w-5xl gap-5 tablet:grid-cols-3 tablet:items-stretch tablet:gap-6">
          {PLANS.map((plan) => {
            const featured = plan.featured;

            return (
              <StaggerItem key={plan.id} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-[22px] p-7 shadow-[0_18px_50px_#12325b14] transition-transform duration-300",
                    featured
                      ? "bg-brand text-white shadow-[0_24px_60px_#1268f355] tablet:scale-[1.03]"
                      : "border border-line bg-card text-ink dark:shadow-[0_18px_50px_#00000040]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-xl",
                        featured ? "bg-white/15 text-white" : "bg-sky text-brand",
                      )}
                    >
                      <Box className="size-5" aria-hidden />
                    </span>
                    <h3 className="m-0 text-[18px] font-bold">
                      {t(`pricing.plans.${plan.id}.name`)}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="text-[42px] leading-none font-extrabold tracking-[-1.5px]">
                      ${plan.price}
                    </span>
                    <span
                      className={cn(
                        "mb-1.5 text-[13px]",
                        featured ? "text-white/75" : "text-muted",
                      )}
                    >
                      / {t("pricing.month")}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "mt-4 mb-0 min-h-[48px] text-[13px] leading-relaxed",
                      featured ? "text-white/85" : "text-muted",
                    )}
                  >
                    {t(`pricing.plans.${plan.id}.description`)}
                  </p>

                  <div
                    className={cn(
                      "my-6 h-px w-full",
                      featured ? "bg-white/25" : "bg-line",
                    )}
                  />

                  <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                    {plan.featureKeys.map((featureKey) => (
                      <li key={featureKey} className="flex items-start gap-2.5 text-[13px]">
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                            featured ? "bg-white/15 text-white" : "bg-sky text-brand",
                          )}
                        >
                          <Check className="size-3 stroke-[3]" aria-hidden />
                        </span>
                        <span>{t(`pricing.plans.${plan.id}.features.${featureKey}`)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <a
                      href="#custom-list"
                      className={cn(
                        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold no-underline transition-transform hover:-translate-y-0.5",
                        featured
                          ? "bg-white text-brand shadow-[0_8px_24px_#00000022]"
                          : "bg-brand text-white shadow-[var(--shadow-btn)]",
                      )}
                    >
                      {t("pricing.cta")}
                      <ArrowRight className="size-4" aria-hidden />
                    </a>
                    <p
                      className={cn(
                        "mt-3 mb-0 text-center text-[11px]",
                        featured ? "text-white/70" : "text-muted",
                      )}
                    >
                      {t("pricing.noCard")}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

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
