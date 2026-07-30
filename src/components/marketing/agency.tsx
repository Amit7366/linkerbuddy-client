"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { AgencyChart } from "@/components/marketing/agency-chart";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "@/providers/locale-provider";

const PERK_KEYS = ["pricing", "manager", "reports", "inventory"] as const;

export function Agency() {
  const { showToast } = useToast();
  const t = useTranslations();

  return (
    <section
      id="agencies"
      className="relative overflow-hidden bg-navy py-[90px] text-white"
      aria-labelledby="agency-heading"
    >
      <div
        className="pointer-events-none absolute -top-[270px] -right-[180px] size-[600px] rounded-full border border-[#5ca3ff2e] shadow-[0_0_0_80px_#5ca3ff0a,0_0_0_160px_#5ca3ff08]"
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-[45px] tablet:grid-cols-[1fr_0.9fr] tablet:gap-[100px]">
          <Reveal>
            <p className="lb-kicker lb-kicker-light">{t("agency.kicker")}</p>
            <h2
              id="agency-heading"
              className="my-3.5 text-[34px] leading-[1.1] font-bold tracking-[-2px] tablet:text-[42px]"
            >
              {t("agency.title")}
            </h2>
            <p className="m-0 max-w-[540px] leading-[1.7] text-[#b6c5db]">
              {t("agency.description")}
            </p>
            <ul className="my-[26px] grid list-none grid-cols-1 gap-3.5 p-0 tablet:grid-cols-2">
              {PERK_KEYS.map((key) => (
                <li
                  key={key}
                  className="text-xs text-[#d5e0ef] before:mr-2 before:text-[#37d0a3] before:content-['✓']"
                >
                  {t(`agency.perks.${key}`)}
                </li>
              ))}
            </ul>
            <Button variant="light" onClick={() => showToast(t("agency.toast"))}>
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
