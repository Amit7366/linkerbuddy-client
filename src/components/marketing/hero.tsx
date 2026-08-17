"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  HERO_ROTATING_KEYS,
  RotatingWord,
  useRotatingWordIndex,
  withCountrySlot,
} from "@/components/motion/rotating-word";
import { HeroProductPreview } from "@/components/marketing/hero-product-preview";
import { HeroStatsStrip } from "@/components/marketing/hero-stats-strip";
import { useTranslations } from "@/providers/locale-provider";

import { scrollToHomeSection } from "@/hooks/use-active-home-nav";

export function Hero() {
  const t = useTranslations();

  const words = useMemo(
    () => HERO_ROTATING_KEYS.map((key) => t(`hero.rotating.${key}`)),
    [t],
  );
  const wordIndex = useRotatingWordIndex(words.length);
  const currentWord = words[wordIndex] ?? words[0] ?? "World";

  const trust = [t("hero.trust.noFees"), t("hero.trust.replacement"), t("hero.trust.reports")];

  const titleRotator = (
    <RotatingWord words={words} index={wordIndex} className="text-[#483EF4]" />
  );
  const breadcrumbRotator = (
    <RotatingWord words={words} index={wordIndex} className="font-semibold text-ink" />
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[image:var(--hero-gradient)] pb-[30px]"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(color-mix(in srgb, #483EF4 45%, white) 1px, transparent 1px)",
          backgroundSize: "25px 25px",
        }}
        aria-hidden
      />
      <div
        className="hero-orb absolute -top-[190px] -right-[120px] size-[480px] rounded-full opacity-80 blur-[2px]"
        style={{ background: "radial-gradient(circle, #483EF429, transparent 68%)" }}
        aria-hidden
      />
      <div
        className="hero-orb absolute -bottom-20 -left-40 size-[300px] rounded-full opacity-80 blur-[2px]"
        style={{ background: "radial-gradient(circle, #10c4951f, transparent 68%)" }}
        aria-hidden
      />

      <Container className="relative z-[1]">
        <nav className="pt-[22px] text-xs text-[#7a869d] dark:text-muted" aria-label="Breadcrumb">
          <ol className="m-0 flex list-none flex-wrap items-center p-0">
            <li>
              <Link href="/" className="text-inherit no-underline hover:text-brand">
                {t("hero.breadcrumbHome")}
              </Link>
            </li>
            <li className="mx-2 text-[#a6b0c0]" aria-hidden>
              ›
            </li>
            <li>{t("hero.breadcrumbGuest")}</li>
            <li className="mx-2 text-[#a6b0c0]" aria-hidden>
              ›
            </li>
            <li aria-live="polite">{breadcrumbRotator}</li>
          </ol>
        </nav>

        <div className="relative z-[2] grid items-center gap-[50px] pt-[38px] pb-[55px] tablet:grid-cols-[1fr_1.05fr] tablet:gap-[72px] tablet:pt-[62px]">
          <Reveal className="text-center tablet:text-left">
            <Badge>
              <span className="lb-eyebrow-dot" aria-hidden>
                ●
              </span>
              {t("hero.eyebrow")}
            </Badge>

            <h1
              id="hero-heading"
              className="my-5 text-[41px] leading-[1.02] font-bold tracking-[-2.3px] text-ink tablet:text-[59px] tablet:tracking-[-3.3px]"
              aria-label={t("hero.title", { country: currentWord })}
            >
              {withCountrySlot(t("hero.title"), titleRotator)}
            </h1>

            <p className="mx-auto m-0 max-w-[590px] text-[15px] leading-[1.65] text-muted tablet:mx-0 tablet:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-[29px] flex flex-col justify-center gap-3 tablet:flex-row tablet:justify-start">
              <ButtonLink
                href="#marketplace"
                className="bg-[#483EF4] hover:bg-[#3b32d6]"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHomeSection("marketplace");
                }}
              >
                {t("hero.ctaBrowse")}
                <ArrowUpRight className="size-4" aria-hidden />
              </ButtonLink>
              <Button variant="ghost" onClick={() => scrollToHomeSection("custom-list")}>
                {t("hero.ctaShortlist")}
              </Button>
            </div>

            <ul className="mt-[23px] flex list-none flex-wrap justify-center gap-x-5 gap-y-2.5 p-0 text-[11px] font-semibold text-muted tablet:justify-start">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <b className="mr-0.5 text-green" aria-hidden>
                    ✓
                  </b>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <HeroProductPreview />
        </div>

        <Reveal delay={0.2}>
          <HeroStatsStrip />
        </Reveal>
      </Container>
    </section>
  );
}
