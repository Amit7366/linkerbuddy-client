"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getPublicReviews } from "@/lib/api/reviews";
import type { PublicReview } from "@/types/review";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4000;
const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2] as const;

function formatReviewDate(value: string) {
  const d = new Date(value);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

function avatarUrl(name: string) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

function wrappedOffset(index: number, active: number, total: number) {
  let offset = index - active;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

/** Arc slot styles: center pops right; neighbors sit on the curve */
function slotStyle(offset: number, reduce: boolean | null) {
  const map: Record<
    number,
    { x: number; y: number; scale: number; opacity: number; z: number }
  > = {
    [-2]: { x: 8, y: -210, scale: 0.55, opacity: 0, z: 1 },
    [-1]: { x: 28, y: -118, scale: 0.72, opacity: 0.55, z: 2 },
    [0]: { x: 72, y: 0, scale: 1.08, opacity: 1, z: 5 },
    [1]: { x: 28, y: 118, scale: 0.72, opacity: 0.55, z: 2 },
    [2]: { x: 8, y: 210, scale: 0.55, opacity: 0, z: 1 },
  };
  const slot = map[offset] ?? { x: 0, y: 0, scale: 0.4, opacity: 0, z: 0 };
  if (reduce) {
    return {
      x: offset === 0 ? 48 : 16,
      y: offset * 100,
      scale: offset === 0 ? 1 : 0.75,
      opacity: Math.abs(offset) <= 1 ? (offset === 0 ? 1 : 0.5) : 0,
      zIndex: slot.z,
    };
  }
  return {
    x: slot.x,
    y: slot.y,
    scale: slot.scale,
    opacity: slot.opacity,
    zIndex: slot.z,
  };
}

function ReviewerAvatar({
  name,
  size,
  active,
}: {
  name: string;
  size: "sm" | "lg";
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[#483EF4]/10 ring-2 ring-white",
        size === "lg" ? "size-[72px]" : "size-[52px]",
        active && "shadow-[0_14px_32px_#483EF430] ring-[3px] ring-white",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl(name)}
        alt=""
        width={size === "lg" ? 72 : 52}
        height={size === "lg" ? 72 : 52}
        className="size-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

export function Reviews() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    let cancelled = false;
    void getPublicReviews(12)
      .then((data) => {
        if (!cancelled) setReviews(data.reviews);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = reviews?.length ?? 0;

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (total === 0) return;
      setDirection(dir);
      setActive(((next % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => {
    goTo(active + 1, 1);
  }, [active, goTo]);

  const goPrev = useCallback(() => {
    goTo(active - 1, -1);
  }, [active, goTo]);

  useEffect(() => {
    if (!reviews || reviews.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % reviews.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reviews, paused]);

  const current = reviews?.[active] ?? null;

  const slots = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews
      .map((review, index) => ({
        review,
        index,
        offset: wrappedOffset(index, active, reviews.length),
      }))
      .filter((item) =>
        (VISIBLE_OFFSETS as readonly number[]).includes(item.offset),
      );
  }, [reviews, active]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      className="lb-section lb-abstract-grid overflow-hidden"
      aria-labelledby="reviews-heading"
      aria-roledescription="carousel"
    >
      <Container className="relative z-[1]">
        <div className="max-w-xl">
          <span
            className="mb-3 block h-1 w-10 rounded-full bg-[#483EF4]"
            aria-hidden
          />
          <h2
            id="reviews-heading"
            className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-1.2px] text-ink"
          >
            {t("reviews.title")}
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 tablet:mt-14 tablet:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] tablet:gap-8 desktop:gap-16">
          {/* Arc carousel */}
          <div
            className="relative mx-auto h-[420px] w-full max-w-[420px] tablet:mx-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setPaused(false);
              }
            }}
          >
            <svg
              className="pointer-events-none absolute top-1/2 left-2 h-[340px] w-[140px] -translate-y-1/2 text-[color-mix(in_srgb,#483EF4_28%,var(--line))]"
              viewBox="0 0 140 340"
              fill="none"
              aria-hidden
            >
              <path
                d="M48 12C110 70 118 170 48 328"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0" role="list">
              {slots.map(({ review, index, offset }) => {
                const isActive = offset === 0;
                const style = slotStyle(offset, reduce);
                return (
                  <motion.button
                    key={review.id}
                    type="button"
                    role="listitem"
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${review.authorName}, ${review.rating} stars`}
                    className={cn(
                      "absolute top-1/2 left-0 flex items-center gap-3 text-left will-change-transform",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#483EF4]/40 focus-visible:ring-offset-2",
                      !isActive && "cursor-pointer",
                    )}
                    initial={false}
                    animate={{
                      x: style.x,
                      y: style.y,
                      scale: style.scale,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                    }}
                    transformTemplate={({ x, y, scale }) =>
                      `translateX(${x}) translateY(calc(-50% + ${y})) scale(${scale})`
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 280, damping: 28 }
                    }
                    onClick={() => {
                      if (offset === 0) return;
                      goTo(index, offset > 0 ? 1 : -1);
                    }}
                  >
                    <ReviewerAvatar
                      name={review.authorName}
                      size={isActive ? "lg" : "sm"}
                      active={isActive}
                    />
                    <span
                      className={cn(
                        "min-w-0 transition-opacity",
                        isActive ? "opacity-100" : "opacity-80",
                      )}
                    >
                      <span
                        className={cn(
                          "block truncate font-semibold text-ink",
                          isActive ? "text-[15px]" : "text-[13px]",
                        )}
                      >
                        {review.authorName}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                        <Star
                          className="size-3 fill-green text-green"
                          strokeWidth={0}
                        />
                        <span>
                          {review.rating.toFixed(1)} on{" "}
                          {formatReviewDate(review.createdAt)}
                        </span>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="absolute right-0 bottom-2 flex gap-2 tablet:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink"
              >
                Next
              </button>
            </div>
          </div>

          {/* Quote panel */}
          <div className="relative min-h-[200px] tablet:min-h-[260px]">
            <span
              className="pointer-events-none absolute -top-3 left-0 font-serif text-[110px] leading-none text-ink/12 select-none"
              aria-hidden
            >
              “
            </span>
            <AnimatePresence mode="wait" custom={direction}>
              {current ? (
                <motion.blockquote
                  key={current.id}
                  custom={direction}
                  initial={
                    reduce
                      ? { opacity: 1 }
                      : { opacity: 0, y: direction > 0 ? 28 : -28 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: direction > 0 ? -24 : 24 }
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-[1] m-0 pt-12"
                >
                  <p className="text-[15px] leading-[1.75] font-normal text-ink not-italic tablet:text-[16px]">
                    {current.description}
                  </p>
                </motion.blockquote>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
