"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HERO_ROTATING_KEYS = [
  "world",
  "usa",
  "india",
  "spain",
  "uk",
  "germany",
  "australia",
  "canada",
  "uae",
] as const;

export type HeroRotatingKey = (typeof HERO_ROTATING_KEYS)[number];

const INTERVAL_MS = 2800;

export function useRotatingWordIndex(length: number, intervalMs = INTERVAL_MS) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [length, intervalMs, reduce]);

  return index;
}

interface RotatingWordProps {
  words: string[];
  index: number;
  className?: string;
}

export function RotatingWord({ words, index, className }: RotatingWordProps) {
  const reduce = useReducedMotion();
  const word = words[index % Math.max(words.length, 1)] ?? "";
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), word);

  if (reduce || words.length <= 1) {
    return <span className={cn("inline-block whitespace-nowrap", className)}>{word}</span>;
  }

  return (
    <span
      className={cn(
        "relative inline-grid overflow-hidden align-baseline leading-[1.05]",
        className,
      )}
      aria-hidden
    >
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          className="col-start-1 row-start-1 inline-block whitespace-nowrap will-change-transform"
          initial={{ y: "115%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-115%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Split a `{country}` template around a React node. */
export function withCountrySlot(template: string, country: ReactNode) {
  const [before = "", after = ""] = template.split("{country}");
  return (
    <>
      {before}
      {country}
      {after}
    </>
  );
}
