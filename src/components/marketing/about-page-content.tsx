"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Handshake,
  Mail,
  MapPinned,
  MessageSquare,
  PenLine,
  Rocket,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/providers/locale-provider";
import { withLocalePrefix } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function OutlineButton({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl border-2 border-brand px-6 py-3 text-[13px] font-bold text-brand no-underline transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white",
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

function SolidButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[13px] font-bold text-white no-underline shadow-[var(--shadow-btn)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function MotionSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.55, ease, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

export function AboutPageContent() {
  const reduce = useReducedMotion();
  const { locale, dictionary } = useLocale();
  const page = dictionary.aboutPage;
  const homeHref = withLocalePrefix("/", locale);
  const contactHref = withLocalePrefix("/contact", locale);
  const marketplaceHref = `${homeHref}#marketplace`;
  const email = siteConfig.contact.email;

  const whyItems = [
    {
      title: page.why.inventoryTitle,
      body: page.why.inventoryBody,
      icon: Globe2,
      tone: "bg-[#e8f1ff] text-brand dark:bg-[#1a2d4d] dark:text-[#7db4ff]",
    },
    {
      title: page.why.metricsTitle,
      body: page.why.metricsBody,
      icon: BarChart3,
      tone: "bg-[#e6f7f0] text-[#0a9d70] dark:bg-[#14352c] dark:text-[#6ee7b7]",
    },
    {
      title: page.why.dealsTitle,
      body: page.why.dealsBody,
      icon: Handshake,
      tone: "bg-[#fff4e5] text-[#c47a00] dark:bg-[#3d2e0f] dark:text-[#fbbf24]",
    },
    {
      title: page.why.policyTitle,
      body: page.why.policyBody,
      icon: ShieldCheck,
      tone: "bg-navy/10 text-navy dark:bg-navy/25 dark:text-[var(--logo-accent)]",
    },
  ];

  const processSteps = [
    { title: page.howWeWork.step1Title, body: page.howWeWork.step1Body, icon: Search, color: "text-brand border-brand/30 bg-brand/10" },
    { title: page.howWeWork.step2Title, body: page.howWeWork.step2Body, icon: MapPinned, color: "text-green border-green/30 bg-green/10" },
    { title: page.howWeWork.step3Title, body: page.howWeWork.step3Body, icon: MessageSquare, color: "text-[#c47a00] border-[#c47a00]/30 bg-[#c47a00]/10" },
    { title: page.howWeWork.step4Title, body: page.howWeWork.step4Body, icon: FileCheck2, color: "text-navy border-navy/30 bg-navy/10" },
    { title: page.howWeWork.step5Title, body: page.howWeWork.step5Body, icon: PenLine, color: "text-brand border-brand/30 bg-brand/10" },
    { title: page.howWeWork.step6Title, body: page.howWeWork.step6Body, icon: Rocket, color: "text-green border-green/30 bg-green/10" },
  ];

  return (
    <div className="overflow-hidden bg-background text-ink">
      {/* Hero */}
      <section className="relative pt-16 pb-12 text-center tablet:pt-20 tablet:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#1268f318_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#62a8ff22_0%,_transparent_45%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,_#3b82f620_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#1268f318_0%,_transparent_45%)]"
        />
        <Container className="relative">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <h1 className="m-0 text-[clamp(2.5rem,6vw,3.75rem)] font-bold tracking-[-0.06em] text-ink">
              {page.heroTitle}
            </h1>
            <nav
              aria-label="Breadcrumb"
              className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted"
            >
              <Link href={homeHref} className="text-muted no-underline hover:text-brand">
                {dictionary.footer.home}
              </Link>
              <span aria-hidden>/</span>
              <span className="font-semibold text-ink">{page.breadcrumb}</span>
            </nav>
          </motion.div>
        </Container>
      </section>

      {/* Intro — image + copy */}
      <section className="pb-16 tablet:pb-20">
        <Container>
          <MotionSection className="mx-auto mb-10 max-w-2xl text-center tablet:mb-14">
            <p className="m-0 text-[15px] leading-relaxed text-muted tablet:text-[16px]">
              {page.introLead}
            </p>
          </MotionSection>

          <div className="grid items-center gap-10 tablet:grid-cols-2 tablet:gap-12 desktop:gap-16">
            <MotionSection>
              <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-product)] ring-1 ring-line">
                <Image
                  src="/about/team.jpg"
                  alt={page.teamImageAlt}
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy/25 via-transparent to-brand/10"
                />
              </div>
            </MotionSection>

            <MotionSection delay={0.08} className="flex flex-col gap-5">
              <p className="m-0 text-[15px] leading-[1.8] text-muted">{page.intro1}</p>
              <p className="m-0 text-[15px] leading-[1.8] text-muted">{page.intro2}</p>
              <div className="pt-2">
                <OutlineButton href={contactHref}>{page.getInTouch}</OutlineButton>
              </div>
            </MotionSection>
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="border-y border-line bg-surface py-16 tablet:py-20">
        <Container>
          <MotionSection className="mx-auto mb-10 max-w-2xl text-center tablet:mb-12">
            <h2 className="m-0 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.04em] text-ink">
              {page.why.title}
            </h2>
            <p className="mt-3 m-0 text-[15px] leading-relaxed text-muted">{page.why.intro}</p>
          </MotionSection>

          <div className="grid gap-5 phablet:grid-cols-2">
            {whyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)] transition-shadow hover:shadow-[var(--shadow-stats)] tablet:p-7"
                  variants={fadeUp}
                  initial={reduce ? false : "hidden"}
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: reduce ? 0 : 0.45,
                    ease,
                    delay: reduce ? 0 : index * 0.06,
                  }}
                >
                  <span
                    className={cn(
                      "mb-4 grid size-12 place-items-center rounded-xl",
                      item.tone,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="m-0 text-[17px] font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{item.body}</p>
                </motion.article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 tablet:py-20">
        <Container>
          <div className="grid gap-12 tablet:grid-cols-[0.95fr_1.05fr] tablet:gap-14 desktop:gap-16">
            <div className="flex flex-col gap-6">
              <MotionSection>
                <h2 className="m-0 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.howWeWork.title}
                </h2>
                <p className="mt-3 m-0 max-w-md text-[15px] leading-relaxed text-muted">
                  {page.howWeWork.intro}
                </p>
                <div className="mt-6">
                  <OutlineButton href={marketplaceHref}>{page.howWeWork.cta}</OutlineButton>
                </div>
              </MotionSection>

              <MotionSection delay={0.1} className="relative mt-2 overflow-hidden rounded-2xl shadow-[var(--shadow-product)] ring-1 ring-line">
                <Image
                  src="/about/process.jpg"
                  alt={page.processImageAlt}
                  width={900}
                  height={1200}
                  className="h-[320px] w-full object-cover tablet:h-[420px]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <motion.div
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-md"
                    animate={
                      reduce
                        ? undefined
                        : { y: [0, -6, 0], rotate: [0, 1.5, 0] }
                    }
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-white text-brand shadow-md">
                      <CheckCircle2 className="size-5" aria-hidden />
                    </span>
                    <span className="grid size-10 place-items-center rounded-full bg-brand text-white shadow-md">
                      <Handshake className="size-5" aria-hidden />
                    </span>
                    <span className="grid size-10 place-items-center rounded-full bg-white text-[#0a9d70] shadow-md">
                      <Rocket className="size-5" aria-hidden />
                    </span>
                  </motion.div>
                </div>
              </MotionSection>
            </div>

            <ul className="m-0 flex list-none flex-col gap-6 p-0 tablet:gap-7">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.title}
                    className="flex gap-4"
                    variants={fadeUp}
                    initial={reduce ? false : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: reduce ? 0 : 0.4,
                      ease,
                      delay: reduce ? 0 : index * 0.05,
                    }}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border",
                        step.color,
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="m-0 text-[16px] font-bold text-ink">{step.title}</h3>
                      <p className="mt-1.5 m-0 text-[14px] leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line bg-surface py-16 tablet:py-20">
        <Container>
          <MotionSection className="mx-auto max-w-2xl text-center">
            <h2 className="m-0 text-[clamp(1.6rem,3.5vw,2.15rem)] font-bold tracking-[-0.04em] text-ink">
              {page.cta.title}
            </h2>
            <p className="mt-3 m-0 text-[15px] leading-relaxed text-muted">{page.cta.body}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 phablet:flex-row">
              <SolidButton href={contactHref}>
                <Mail className="size-4" aria-hidden />
                {page.cta.contact}
              </SolidButton>
              <OutlineButton href={marketplaceHref}>{page.cta.browse}</OutlineButton>
            </div>
            <a
              href={`mailto:${email}`}
              className="mt-5 inline-block text-[13px] text-muted no-underline transition-colors hover:text-brand"
            >
              {page.cta.emailLabel}: {email}
            </a>
          </MotionSection>
        </Container>
      </section>
    </div>
  );
}
