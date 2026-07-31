"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Link2, TrendingUp } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function AuthBrandPanel() {
  const reduce = useReducedMotion();

  return (
    <aside
      className="relative hidden min-h-screen overflow-hidden bg-navy lg:flex lg:w-[45%] lg:items-center lg:justify-center"
      aria-hidden
    >
      {/* Layered abstract shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] -right-[15%] h-[70%] w-[70%] rounded-full bg-[#1268f3]/35 blur-3xl" />
        <div className="absolute top-[30%] -left-[25%] h-[55%] w-[55%] rounded-full bg-[#3b82f6]/25 blur-3xl" />
        <div className="absolute right-[8%] bottom-[10%] h-[40%] w-[40%] rounded-[40%] bg-[#075be2]/40 blur-2xl" />
        <div className="absolute top-[12%] left-[18%] h-48 w-48 rotate-12 rounded-[2rem] border border-white/10 bg-white/5" />
        <div className="absolute right-[12%] bottom-[22%] h-36 w-36 -rotate-6 rounded-full border border-white/10 bg-white/5" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-5 px-10">
        <motion.div
          className="rounded-[22px] bg-white p-5 shadow-[0_24px_60px_#02060f50]"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#a86500]">
                Placements
              </p>
              <p className="mt-1 text-[32px] font-bold tracking-[-1.5px] text-ink">2,480+</p>
              <p className="mt-0.5 text-[13px] text-muted">Verified Indian sites</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white shadow-lg">
              <Link2 className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </div>
          <svg
            viewBox="0 0 280 64"
            className="mt-4 h-14 w-full"
            fill="none"
            aria-hidden
          >
            <path
              d="M0 48 C28 44 40 20 70 28 C100 36 110 10 140 18 C170 26 180 40 210 32 C240 24 255 12 280 8"
              stroke="#1268f3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 54 C32 50 48 36 78 40 C108 44 120 28 150 34 C180 40 195 48 224 42 C250 37 265 30 280 26"
              stroke="#ffb13b"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </motion.div>

        <motion.div
          className="flex items-start gap-3.5 rounded-[18px] bg-white p-4 shadow-[0_20px_50px_#02060f40]"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease, delay: 0.22 }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff0d8] text-[#a86500]">
            <TrendingUp className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[15px] font-bold tracking-[-0.3px] text-ink">
              Links that move rankings
            </p>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              Transparent pricing, DR filters, and fast turnaround on every placement.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2.5 self-start rounded-full bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_#02060f35]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.34 }}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e7fbf4] text-[#087b5a]">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span className="text-[12px] font-semibold text-ink">Manual QA on every site</span>
        </motion.div>
      </div>
    </aside>
  );
}
