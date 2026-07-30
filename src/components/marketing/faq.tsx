"use client";

import Link from "next/link";
import { FAQ_KEYS } from "@/config/landing";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { useTranslations } from "@/providers/locale-provider";

export function Faq() {
  const t = useTranslations();

  const items = FAQ_KEYS.map((key) => ({
    question: t(`faq.items.${key}.q`),
    answer: t(`faq.items.${key}.a`),
  }));

  return (
    <section id="faq" className="lb-section bg-surface" aria-labelledby="faq-heading">
      <Container>
        <div className="grid gap-10 tablet:grid-cols-[0.65fr_1fr] tablet:gap-[90px]">
          <Reveal>
            <p className="lb-kicker">{t("faq.kicker")}</p>
            <h2
              id="faq-heading"
              className="my-3 text-[30px] font-bold tracking-[-1.8px] text-ink tablet:text-[39px]"
            >
              {t("faq.title")}
            </h2>
            <p className="m-0 leading-relaxed text-muted">{t("faq.description")}</p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-xs font-bold text-brand no-underline hover:underline"
            >
              {t("faq.contact")}
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
