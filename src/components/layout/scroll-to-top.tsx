"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "@/providers/locale-provider";

const SHOW_AFTER = 320;
const SIZE = 44;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTop() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const nextProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      setVisible(scrollTop > SHOW_AFTER);
      setProgress(nextProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={t("scrollToTop.label")}
          onClick={scrollTop}
          className="pointer-events-auto relative grid size-11 place-items-center rounded-full border-0 bg-card text-brand shadow-[0_10px_26px_color-mix(in_srgb,var(--navy)_16%,transparent)] ring-1 ring-line outline-none transition-colors hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.82 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.88 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <svg
            className="pointer-events-none absolute inset-0 -rotate-90"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-line dark:text-white/12"
            />
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              className="text-brand"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 120, damping: 24, mass: 0.4 }
              }
            />
          </svg>

          <motion.span
            className="relative grid place-items-center"
            animate={reduce ? undefined : { y: [0, -1.5, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ArrowUp className="size-4" strokeWidth={2.4} aria-hidden />
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
