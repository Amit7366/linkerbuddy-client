"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BarChart3,
  Clock3,
  FileCheck2,
  FileText,
  Globe2,
  Handshake,
  Link2,
  Mail,
  MessageSquare,
  PenLine,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  Wallet,
  Zap,
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

const TOC_IDS = [
  "intro",
  "definitions",
  "guest-benefits",
  "niche-benefits",
  "compare",
  "when",
  "why",
  "workflow",
  "combine",
] as const;

function formatPostDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function OutlineButton({
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
        "inline-flex items-center justify-center rounded-xl border-2 border-brand px-6 py-3 text-[13px] font-bold text-brand no-underline transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white",
        className,
      )}
    >
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
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={cn("scroll-mt-28", className)}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.55, ease, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.section>
  );
}

interface BlogArticleContentProps {
  date: string;
  readingMinutes: number;
}

export function BlogArticleContent({ date, readingMinutes }: BlogArticleContentProps) {
  const reduce = useReducedMotion();
  const { locale, dictionary } = useLocale();
  const page = dictionary.blogArticle;
  const homeHref = withLocalePrefix("/", locale);
  const blogHref = withLocalePrefix("/blog", locale);
  const contactHref = withLocalePrefix("/contact", locale);
  const marketplaceHref = `${homeHref}#marketplace`;
  const email = siteConfig.contact.email;
  const readTime = page.readTime.replace("{minutes}", String(readingMinutes));

  const tocItems = [
    { id: "intro", label: page.toc.intro },
    { id: "definitions", label: page.toc.definitions },
    { id: "guest-benefits", label: page.toc.guestBenefits },
    { id: "niche-benefits", label: page.toc.nicheBenefits },
    { id: "compare", label: page.toc.compare },
    { id: "when", label: page.toc.when },
    { id: "why", label: page.toc.why },
    { id: "workflow", label: page.toc.workflow },
    { id: "combine", label: page.toc.combine },
  ] as const satisfies ReadonlyArray<{ id: (typeof TOC_IDS)[number]; label: string }>;

  const guestPoints = [page.guest.point1, page.guest.point2, page.guest.point3, page.guest.point4];
  const nichePoints = [page.niche.point1, page.niche.point2];

  const guestBenefits = [
    {
      title: page.guestBenefits.controlTitle,
      body: page.guestBenefits.controlBody,
      icon: SlidersHorizontal,
      tone: "bg-[#e8f1ff] text-brand dark:bg-[#1a2d4d] dark:text-[#7db4ff]",
    },
    {
      title: page.guestBenefits.brandTitle,
      body: page.guestBenefits.brandBody,
      icon: Award,
      tone: "bg-[#fff4e5] text-[#c47a00] dark:bg-[#3d2e0f] dark:text-[#fbbf24]",
    },
    {
      title: page.guestBenefits.nicheTitle,
      body: page.guestBenefits.nicheBody,
      icon: Target,
      tone: "bg-navy/10 text-navy dark:bg-navy/25 dark:text-[var(--logo-accent)]",
    },
  ];

  const nicheBenefits = [
    {
      title: page.nicheBenefits.authorityTitle,
      body: page.nicheBenefits.authorityBody,
      icon: ShieldCheck,
      tone: "bg-[#e6f7f0] text-[#0a9d70] dark:bg-[#14352c] dark:text-[#6ee7b7]",
    },
    {
      title: page.nicheBenefits.speedTitle,
      body: page.nicheBenefits.speedBody,
      icon: Timer,
      tone: "bg-[#e8f1ff] text-brand dark:bg-[#1a2d4d] dark:text-[#7db4ff]",
    },
    {
      title: page.nicheBenefits.costTitle,
      body: page.nicheBenefits.costBody,
      icon: Wallet,
      tone: "bg-[#fff4e5] text-[#c47a00] dark:bg-[#3d2e0f] dark:text-[#fbbf24]",
    },
  ];

  const compareRows = [
    [page.compare.content, page.compare.contentGuest, page.compare.contentNiche],
    [page.compare.indexing, page.compare.indexingGuest, page.compare.indexingNiche],
    [page.compare.turnaround, page.compare.turnaroundGuest, page.compare.turnaroundNiche],
    [page.compare.control, page.compare.controlGuest, page.compare.controlNiche],
    [page.compare.objective, page.compare.objectiveGuest, page.compare.objectiveNiche],
  ];

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
  ];

  const workflowSteps = [
    { title: page.workflow.step1Title, body: page.workflow.step1Body, icon: Search },
    { title: page.workflow.step2Title, body: page.workflow.step2Body, icon: MessageSquare },
    { title: page.workflow.step3Title, body: page.workflow.step3Body, icon: Rocket },
    { title: page.workflow.step4Title, body: page.workflow.step4Body, icon: FileCheck2 },
  ];

  return (
    <div className="overflow-hidden bg-background text-ink">
      <section className="relative pt-16 pb-12 tablet:pt-20 tablet:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#1268f318_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#62a8ff22_0%,_transparent_45%)] dark:bg-[radial-gradient(ellipse_at_20%_0%,_#3b82f620_0%,_transparent_50%),radial-gradient(ellipse_at_90%_10%,_#1268f318_0%,_transparent_45%)]"
        />
        <Container className="relative">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center justify-center gap-2 text-[13px] text-muted"
            >
              <Link href={homeHref} className="text-muted no-underline hover:text-brand">
                {dictionary.footer.home}
              </Link>
              <span aria-hidden>/</span>
              <Link href={blogHref} className="text-muted no-underline hover:text-brand">
                {dictionary.blogIndex.breadcrumb}
              </Link>
              <span aria-hidden>/</span>
              <span className="font-semibold text-ink">{page.breadcrumb}</span>
            </nav>
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand">
              {page.category}
            </span>
            <h1 className="mt-4 m-0 text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-[-0.06em] text-ink">
              {page.title}
            </h1>
            <p className="mt-4 m-0 text-[16px] leading-relaxed text-muted tablet:text-[18px]">
              {page.subtitle}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[13px] text-muted">
              <time dateTime={date}>{formatPostDate(date, locale)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" aria-hidden />
                {readTime}
              </span>
            </div>
          </motion.div>
        </Container>
      </section>

      <div className="pb-8 tablet:pb-10">
        <Container>
          <div className="grid gap-12 desktop:grid-cols-[220px_minmax(0,1fr)] desktop:gap-16">
            <aside className="hidden desktop:block">
              <nav
                aria-label={page.tocTitle}
                className="sticky top-24 rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-benefit)]"
              >
                <p className="m-0 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                  {page.tocTitle}
                </p>
                <ul className="mt-3 m-0 flex list-none flex-col gap-1.5 p-0">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-lg px-2 py-1.5 text-[13px] font-semibold text-muted no-underline transition-colors hover:bg-surface hover:text-brand"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="flex min-w-0 flex-col gap-16 tablet:gap-20">
              <MotionSection id="intro">
                <p className="m-0 text-[12px] font-bold uppercase tracking-[0.1em] text-brand">
                  {page.intro.kicker}
                </p>
                <h2 className="mt-2 m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.intro.title}
                </h2>
                <p className="mt-3 m-0 max-w-2xl text-[15px] leading-[1.8] text-muted">
                  {page.intro.body}
                </p>
              </MotionSection>

              <MotionSection id="definitions">
                <div className="grid gap-5 tablet:grid-cols-2">
                  <article className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)] tablet:p-7">
                    <span className="mb-4 grid size-12 place-items-center rounded-xl bg-[#e8f1ff] text-brand dark:bg-[#1a2d4d] dark:text-[#7db4ff]">
                      <PenLine className="size-5" aria-hidden />
                    </span>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.08em] text-brand">
                      {page.guest.kicker}
                    </p>
                    <h3 className="mt-2 m-0 text-[18px] font-bold text-ink">{page.guest.title}</h3>
                    <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{page.guest.body}</p>
                    <ul className="mt-4 m-0 flex list-none flex-col gap-2.5 p-0">
                      {guestPoints.map((point) => (
                        <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                          <FileText className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)] tablet:p-7">
                    <span className="mb-4 grid size-12 place-items-center rounded-xl bg-[#e6f7f0] text-[#0a9d70] dark:bg-[#14352c] dark:text-[#6ee7b7]">
                      <Link2 className="size-5" aria-hidden />
                    </span>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0a9d70]">
                      {page.niche.kicker}
                    </p>
                    <h3 className="mt-2 m-0 text-[18px] font-bold text-ink">{page.niche.title}</h3>
                    <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{page.niche.body}</p>
                    <ul className="mt-4 m-0 flex list-none flex-col gap-2.5 p-0">
                      {nichePoints.map((point) => (
                        <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                          <Zap className="mt-0.5 size-4 shrink-0 text-[#0a9d70]" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </MotionSection>

              <MotionSection id="guest-benefits">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.guestBenefits.title}
                </h2>
                <div className="mt-6 grid gap-5 phablet:grid-cols-3">
                  {guestBenefits.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.article
                        key={item.title}
                        className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)]"
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
                        <span className={cn("mb-4 grid size-12 place-items-center rounded-xl", item.tone)}>
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <h3 className="m-0 text-[16px] font-bold text-ink">{item.title}</h3>
                        <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{item.body}</p>
                      </motion.article>
                    );
                  })}
                </div>
              </MotionSection>

              <MotionSection id="niche-benefits">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.nicheBenefits.title}
                </h2>
                <div className="mt-6 grid gap-5 phablet:grid-cols-3">
                  {nicheBenefits.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.article
                        key={item.title}
                        className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)]"
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
                        <span className={cn("mb-4 grid size-12 place-items-center rounded-xl", item.tone)}>
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <h3 className="m-0 text-[16px] font-bold text-ink">{item.title}</h3>
                        <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{item.body}</p>
                      </motion.article>
                    );
                  })}
                </div>
              </MotionSection>

              <MotionSection id="compare">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.compare.title}
                </h2>
                <div className="mt-6 hidden overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-benefit)] tablet:block">
                  <table className="w-full border-collapse text-left text-[14px]">
                    <thead className="bg-surface">
                      <tr>
                        <th className="px-5 py-3.5 font-bold text-ink">{page.compare.feature}</th>
                        <th className="px-5 py-3.5 font-bold text-brand">{page.compare.guest}</th>
                        <th className="px-5 py-3.5 font-bold text-[#0a9d70]">{page.compare.niche}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareRows.map((row) => (
                        <tr key={row[0]} className="border-t border-line">
                          <th className="px-5 py-3.5 font-semibold text-ink">{row[0]}</th>
                          <td className="px-5 py-3.5 text-muted">{row[1]}</td>
                          <td className="px-5 py-3.5 text-muted">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 grid gap-4 tablet:hidden">
                  {compareRows.map((row) => (
                    <article
                      key={row[0]}
                      className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-benefit)]"
                    >
                      <h3 className="m-0 text-[14px] font-bold text-ink">{row[0]}</h3>
                      <dl className="mt-3 m-0 grid gap-3">
                        <div>
                          <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand">
                            {page.compare.guest}
                          </dt>
                          <dd className="mt-1 m-0 text-[13px] text-muted">{row[1]}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0a9d70]">
                            {page.compare.niche}
                          </dt>
                          <dd className="mt-1 m-0 text-[13px] text-muted">{row[2]}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </MotionSection>

              <MotionSection id="when">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.when.title}
                </h2>
                <div className="mt-6 grid gap-5 tablet:grid-cols-2">
                  <article className="rounded-2xl border border-[#0a9d70]/25 bg-[#e6f7f0]/50 p-6 dark:bg-[#14352c]/40 tablet:p-7">
                    <h3 className="m-0 text-[17px] font-bold text-ink">{page.when.nicheTitle}</h3>
                    <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{page.when.nicheBody}</p>
                  </article>
                  <article className="rounded-2xl border border-brand/25 bg-brand/5 p-6 tablet:p-7">
                    <h3 className="m-0 text-[17px] font-bold text-ink">{page.when.guestTitle}</h3>
                    <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{page.when.guestBody}</p>
                  </article>
                </div>
              </MotionSection>

              <MotionSection id="why">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.why.title}
                </h2>
                <div className="mt-6 grid gap-5 phablet:grid-cols-3">
                  {whyItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.article
                        key={item.title}
                        className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)]"
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
                        <span className={cn("mb-4 grid size-12 place-items-center rounded-xl", item.tone)}>
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <h3 className="m-0 text-[16px] font-bold text-ink">{item.title}</h3>
                        <p className="mt-2 m-0 text-[14px] leading-relaxed text-muted">{item.body}</p>
                      </motion.article>
                    );
                  })}
                </div>
              </MotionSection>

              <MotionSection id="workflow">
                <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                  {page.workflow.title}
                </h2>
                <ol className="mt-6 m-0 grid list-none gap-4 p-0 phablet:grid-cols-2">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <li
                        key={step.title}
                        className="relative rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-benefit)]"
                      >
                        <span className="absolute top-5 right-5 text-[28px] font-bold tracking-[-0.06em] text-brand/15">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mb-4 grid size-11 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <h3 className="m-0 text-[16px] font-bold text-ink">{step.title}</h3>
                        <p className="mt-1.5 m-0 text-[14px] leading-relaxed text-muted">{step.body}</p>
                      </li>
                    );
                  })}
                </ol>
              </MotionSection>

              <MotionSection id="combine">
                <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-10 text-white shadow-[var(--shadow-cta)] tablet:px-10 tablet:py-12">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--blue)_33%,transparent)_0%,transparent_50%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--green)_25%,transparent)_0%,transparent_45%)]"
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/90">
                      <Sparkles className="size-3.5" aria-hidden />
                      {page.combine.kicker}
                    </span>
                    <h2 className="mt-4 m-0 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-[-0.04em]">
                      {page.combine.title}
                    </h2>
                    <p className="mt-3 m-0 max-w-2xl text-[15px] leading-relaxed text-white/75">
                      {page.combine.body}
                    </p>
                    <p className="mt-5 m-0 text-[14px] font-bold text-orange">{page.combine.cta}</p>
                  </div>
                </div>
              </MotionSection>
            </div>
          </div>
        </Container>
      </div>

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
