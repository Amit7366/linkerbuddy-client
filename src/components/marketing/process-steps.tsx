"use client";

import { PROCESS_STEP_KEYS } from "@/config/landing";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

export function ProcessSteps() {
  const t = useTranslations();

  return (
    <section id="how-it-works" className="lb-section" aria-labelledby="steps-heading">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            id="steps-heading"
            kicker={t("steps.kicker")}
            title={t("steps.title")}
          />
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-0 tablet:mt-[45px] tablet:grid-cols-2 tablet:gap-x-0 tablet:gap-y-[35px] desktop:grid-cols-4">
          {PROCESS_STEP_KEYS.map((step, index) => (
            <StaggerItem key={step}>
              <article
                className={cn(
                  "relative px-0 py-5 tablet:px-[30px] tablet:py-0 tablet:pt-0",
                  index > 0 && "border-t border-line tablet:border-t-0",
                  index > 0 && "tablet:border-l tablet:border-line",
                  index === 2 && "tablet:border-l-0 desktop:border-l",
                )}
              >
                <span className="rounded-full bg-[#483EF4]/10 px-2.5 py-1.5 text-[10px] font-extrabold text-[#483EF4]">
                  {step}
                </span>
                <h3 className="mt-[18px] mb-2.5 text-[15px] font-bold text-ink">
                  {t(`steps.items.${step}.title`)}
                </h3>
                <p className="m-0 text-xs leading-[1.65] text-muted">
                  {t(`steps.items.${step}.description`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
