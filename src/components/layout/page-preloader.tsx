"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/providers/locale-provider";

const MIN_VISIBLE_MS = 1400;
const MAX_WAIT_MS = 4200;
const ease = [0.22, 1, 0.36, 1] as const;

export function PagePreloader() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVisible(false);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    let finished = false;
    let loadDone = document.readyState === "complete";

    const tick = () => {
      if (finished) return;

      const elapsed = performance.now() - startedAt;
      const timeProgress = Math.min(elapsed / MIN_VISIBLE_MS, 0.92);
      const loadBoost = loadDone ? 1 : Math.min(elapsed / MAX_WAIT_MS, 0.85);
      const next = Math.max(timeProgress, loadBoost) * 100;

      setProgress((prev) => Math.max(prev, next));

      if (loadDone && elapsed >= MIN_VISIBLE_MS) {
        finished = true;
        setProgress(100);
        window.setTimeout(() => setVisible(false), 220);
        return;
      }

      if (elapsed >= MAX_WAIT_MS) {
        finished = true;
        setProgress(100);
        window.setTimeout(() => setVisible(false), 180);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const onLoad = () => {
      loadDone = true;
    };

    if (!loadDone) {
      window.addEventListener("load", onLoad, { once: true });
    }

    document.body.style.overflow = "hidden";
    frame = requestAnimationFrame(tick);

    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-navy"
          role="status"
          aria-live="polite"
          aria-label={t("preloader.label")}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--blue) 33%, transparent) 0%, transparent 62%), radial-gradient(ellipse 50% 40% at 80% 85%, color-mix(in srgb, var(--logo-accent) 13%, transparent) 0%, transparent 55%)",
            }}
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-brand/20 blur-3xl"
            animate={reduce ? undefined : { x: [0, 24, 0], y: [0, 16, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-20 -bottom-28 size-80 rounded-full bg-[var(--logo-accent)]/15 blur-3xl"
            animate={reduce ? undefined : { x: [0, -18, 0], y: [0, -22, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6"
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 1.03 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="relative mb-7 grid size-[88px] place-items-center">
              <motion.span
                className="absolute inset-0 rounded-[28px] border border-[var(--logo-mark)]/35"
                animate={reduce ? undefined : { rotate: 360, scale: [1, 1.06, 1] }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                }}
                aria-hidden
              />
              <motion.span
                className="absolute inset-[-10px] rounded-[34px] border border-dashed border-[var(--logo-mark)]/20"
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />
              <motion.div
                className="relative grid size-[58px] place-items-center"
                animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={siteConfig.mark}
                  alt=""
                  width={58}
                  height={58}
                  className="size-[58px] object-contain drop-shadow-[0_0_28px_color-mix(in_srgb,var(--blue)_45%,transparent)]"
                  priority
                  unoptimized
                />
              </motion.div>
            </div>

            <motion.p
              className="m-0 text-[28px] font-extrabold tracking-[-0.8px] text-white"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.18 }}
            >
              Linker
              <span className="text-[#F00E58]">buddy</span>
            </motion.p>

            <motion.p
              className="mt-2 mb-0 text-[11px] font-semibold tracking-[1.4px] text-white/55 uppercase"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.32 }}
            >
              {siteConfig.tagline}
            </motion.p>

            <div className="mt-8 w-[180px]">
              <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand via-[var(--logo-accent)] to-[#9fd0ff]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 22 }}
                />
              </div>
              <motion.p
                className="mt-3 mb-0 text-center text-[11px] font-medium text-white/50"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t("preloader.loading")}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
