"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock3, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { blogPosts, NICHE_EDITS_SLUG } from "@/content/blog/posts";
import { useLocale } from "@/providers/locale-provider";
import { withLocalePrefix } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function formatPostDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function BlogIndexContent() {
  const reduce = useReducedMotion();
  const { locale, dictionary } = useLocale();
  const page = dictionary.blogIndex;
  const article = dictionary.blogArticle;
  const homeHref = withLocalePrefix("/", locale);

  return (
    <div className="overflow-hidden bg-background text-ink">
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
            <p className="mx-auto mt-4 m-0 max-w-xl text-[15px] leading-relaxed text-muted tablet:text-[16px]">
              {page.subtitle}
            </p>
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

      <section className="pb-20 tablet:pb-24">
        <Container>
          <ul className="m-0 grid list-none gap-6 p-0">
            {blogPosts.map((post, index) => {
              const href = withLocalePrefix(`/blog/${post.slug}`, locale);
              const copy = post.slug === NICHE_EDITS_SLUG ? article : null;
              if (!copy) return null;
              const readTime = page.readTime.replace("{minutes}", String(post.readingMinutes));

              return (
                <motion.li
                  key={post.slug}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.08 + index * 0.06 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "group grid overflow-hidden rounded-2xl border border-line bg-card no-underline shadow-[var(--shadow-benefit)] transition-all",
                      "hover:-translate-y-0.5 hover:shadow-[var(--shadow-stats)]",
                      "tablet:grid-cols-[1.15fr_0.85fr]",
                    )}
                  >
                    <div className="flex flex-col gap-4 p-6 tablet:p-8 desktop:p-10">
                      <div className="flex flex-wrap items-center gap-2">
                        {post.featured ? (
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand">
                            {page.featuredLabel}
                          </span>
                        ) : null}
                        <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                          {copy.category}
                        </span>
                      </div>
                      <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.04em] text-ink">
                        {copy.title}
                      </h2>
                      <p className="m-0 text-[15px] leading-relaxed text-muted">{copy.subtitle}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-4 pt-2 text-[13px] text-muted">
                        <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5" aria-hidden />
                          {readTime}
                        </span>
                      </div>
                      <span className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-brand">
                        {page.readArticle}
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                    <div className="relative hidden min-h-[220px] overflow-hidden bg-[image:var(--blog-gradient)] tablet:block">
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#ffffff33_0%,transparent_42%)]"
                      />
                      <div className="absolute inset-0 grid place-items-center p-8">
                        <div className="flex max-w-[240px] flex-col gap-3 text-white">
                          <span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                            <FileText className="size-5" aria-hidden />
                          </span>
                          <p className="m-0 text-[18px] font-bold leading-snug tracking-[-0.03em]">
                            {copy.compare.guest} vs {copy.compare.niche.split(" (")[0]}
                          </p>
                          <p className="m-0 text-[13px] leading-relaxed text-white/75">
                            {copy.combine.kicker}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </Container>
      </section>
    </div>
  );
}
