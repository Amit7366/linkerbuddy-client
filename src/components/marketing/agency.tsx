"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { AgencyChart } from "@/components/marketing/agency-chart";
import { scrollToHomeSection } from "@/hooks/use-active-home-nav";
import { useTranslations } from "@/providers/locale-provider";

const PERK_KEYS = ["pricing", "manager", "reports", "inventory"] as const;

export function Agency() {
  const t = useTranslations();

  return (
    <section
      id="agencies"
      className="relative overflow-hidden bg-navy py-16 text-white tablet:py-[90px]"
      aria-labelledby="agency-heading"
    >
      <div
        className="pointer-events-none absolute -top-[270px] -right-[180px] size-[600px] rounded-full border border-[#5ca3ff2e] shadow-[0_0_0_80px_#5ca3ff0a,0_0_0_160px_#5ca3ff08]"
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-10 tablet:grid-cols-[1fr_0.9fr] tablet:gap-12 desktop:gap-[100px]">
          <Reveal>
            <p className="lb-kicker lb-kicker-light">{t("agency.kicker")}</p>
            <h2
              id="agency-heading"
              className="my-3.5 text-[clamp(1.75rem,4vw,2.625rem)] leading-[1.12] font-bold tracking-[-0.04em]"
            >
              {t("agency.title")}
            </h2>
            <p className="m-0 max-w-[540px] leading-[1.7] text-white/70">
              {t("agency.description")}
            </p>
            <ul className="my-[26px] grid list-none grid-cols-1 gap-3 p-0 phablet:grid-cols-2 tablet:gap-3.5">
              {PERK_KEYS.map((key) => (
                <li
                  key={key}
                  className="text-xs text-white/80 before:mr-2 before:text-green before:content-['✓']"
                >
                  {t(`agency.perks.${key}`)}
                </li>
              ))}
            </ul>
            <Button variant="light" onClick={() => scrollToHomeSection("custom-list")}>
              {t("agency.cta")}
            </Button>
          </Reveal>

          <Reveal delay={0.12}>
            <AgencyChart />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
