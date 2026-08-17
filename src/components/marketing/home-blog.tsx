"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedPost, NICHE_EDITS_SLUG } from "@/content/blog/posts";
import { withLocalePrefix } from "@/i18n/routing";
import { useLocale } from "@/providers/locale-provider";

export function HomeBlog() {
  const { locale, dictionary } = useLocale();
  const post = getFeaturedPost();
  const page = dictionary.blogIndex;
  const article = post.slug === NICHE_EDITS_SLUG ? dictionary.blogArticle : null;

  if (!article) return null;

  const href = withLocalePrefix(`/blog/${post.slug}`, locale);
  const indexHref = withLocalePrefix("/blog", locale);

  return (
    <section id="blog" className="lb-section bg-background" aria-labelledby="home-blog-heading">
      <Container>
        <Reveal>
          <div className="mb-7 flex flex-col gap-4 phablet:mb-8 phablet:flex-row phablet:items-end phablet:justify-between">
            <h2
              id="home-blog-heading"
              className="m-0 text-[clamp(1.875rem,4vw,2.375rem)] font-bold tracking-[-1.8px] text-ink"
            >
              {page.homeTitle}
            </h2>
            <Link
              href={indexHref}
              className="inline-flex w-fit items-center justify-center rounded-full border border-line bg-card px-5 py-2.5 text-[13px] font-semibold text-ink no-underline shadow-[var(--shadow-benefit)] transition-colors hover:bg-surface"
            >
              {page.browseAll}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href={href}
            aria-label={`${page.openArticle}: ${article.title}`}
            className="group relative isolate block min-h-[340px] overflow-hidden rounded-[28px] no-underline tablet:min-h-[420px] tablet:rounded-[32px]"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-navy transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            >
              <div className="absolute inset-0 bg-[image:var(--blog-gradient)]" />
              <div className="absolute -top-[18%] left-[8%] size-[520px] rounded-full bg-brand/45 blur-[90px]" />
              <div className="absolute top-[12%] right-[-8%] size-[380px] rounded-full bg-[var(--logo-accent)]/28 blur-[80px]" />
              <div className="absolute right-[8%] bottom-[-22%] size-[420px] rounded-full bg-green/30 blur-[90px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#ffffff22_0%,transparent_42%)]" />
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"
            />

            <span
              aria-hidden
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-ink shadow-[0_8px_24px_#00000033] transition-transform duration-300 group-hover:rotate-45 tablet:top-6 tablet:right-6 tablet:size-12"
            >
              <ArrowUpRight className="size-5" strokeWidth={2.25} />
            </span>

            <div
              aria-hidden
              className="pointer-events-none absolute top-[18%] right-[7%] hidden w-[280px] desktop:block"
            >
              <div className="absolute top-10 left-10 rotate-6 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_#00000040] backdrop-blur-md">
                <p className="m-0 text-[10px] font-bold tracking-[0.14em] text-white/55 uppercase">
                  {article.compare.niche.split(" (")[0]}
                </p>
                <p className="mt-2 mb-0 text-[15px] font-bold text-white">
                  {article.compare.turnaroundNiche}
                </p>
              </div>
              <div className="relative -rotate-3 rounded-2xl border border-white/20 bg-white/12 p-4 shadow-[0_24px_60px_#00000050] backdrop-blur-md">
                <p className="m-0 text-[10px] font-bold tracking-[0.14em] text-white/55 uppercase">
                  {article.compare.guest}
                </p>
                <p className="mt-2 mb-0 text-[15px] font-bold text-white">
                  {article.compare.turnaroundGuest}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-6 tablet:min-h-[420px] tablet:p-10 desktop:max-w-[62%]">
              <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-white/70 uppercase">
                {article.category}
              </p>
              <h3 className="mt-2 mb-0 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.04em] text-white">
                {article.title}
              </h3>
              <p className="mt-3 mb-0 max-w-[34rem] text-[14px] leading-relaxed text-white/80 tablet:text-[16px]">
                {article.subtitle}
              </p>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
