"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";

const BENEFIT_KEYS = [
  { key: "inventory", icon: "◉" },
  { key: "processing", icon: "↯" },
  { key: "replacement", icon: "♢" },
  { key: "report", icon: "▤" },
] as const;

export function Benefits() {
  const t = useTranslations();

  return (
    <section
      id="services"
      className="lb-section border-y border-line bg-surface"
      aria-labelledby="benefits-heading"
    >
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            id="benefits-heading"
            kicker={t("benefits.kicker")}
            title={t("benefits.title")}
          />
        </Reveal>

        <Stagger className="mt-[34px] grid gap-3.5 phablet:grid-cols-2 desktop:grid-cols-4">
          {BENEFIT_KEYS.map((benefit) => (
            <StaggerItem key={benefit.key}>
              <article className="h-full rounded-[14px] border border-line bg-card p-5 shadow-[var(--shadow-benefit)] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#483EF4]/35 phablet:p-[25px]">
                <span className="grid size-10 place-items-center rounded-[10px] bg-[#483EF4]/10 text-xl text-[#483EF4]">
                  {benefit.icon}
                </span>
                <h3 className="mt-[18px] mb-2.5 text-[15px] font-bold text-ink">
                  {t(`benefits.items.${benefit.key}.title`)}
                </h3>
                <p className="m-0 text-xs leading-[1.65] text-muted">
                  {t(`benefits.items.${benefit.key}.description`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
