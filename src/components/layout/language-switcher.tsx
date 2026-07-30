"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { useLocale } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const active = localeMeta[locale];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const select = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-[12px] font-semibold text-[var(--nav-link)] transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white",
          open && "border-white/25 bg-white/10 text-white",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t("common.chooseLanguage")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-base leading-none" aria-hidden>
          {active.flag}
        </span>
        {!compact ? (
          <span className="hidden max-w-[72px] truncate phablet:inline">{active.nativeName}</span>
        ) : null}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className="inline-flex"
        >
          <ChevronDown className="size-3.5 opacity-80" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="listbox"
            aria-label={t("common.language")}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[calc(100%+10px)] right-0 z-[80] w-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#0a2147] p-1.5 shadow-[0_20px_50px_#03122880] dark:border-white/15 dark:bg-[#071528]"
          >
            <div className="mb-1 px-2.5 pt-1.5 pb-1 text-[9px] font-bold tracking-[1.2px] text-[#7f93b3] uppercase">
              {t("common.chooseLanguage")}
            </div>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {locales.map((code, index) => {
                const meta = localeMeta[code];
                const isActive = code === locale;
                return (
                  <motion.li
                    key={code}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.03 * index, duration: 0.16 }}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => select(code)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-[10px] border-0 px-2.5 py-2.5 text-left transition-colors",
                        isActive
                          ? "bg-brand/20 text-white"
                          : "bg-transparent text-[#d5e0ef] hover:bg-white/8 hover:text-white",
                      )}
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-xl leading-none"
                        aria-hidden
                      >
                        {meta.flag}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold">{meta.nativeName}</span>
                        <span className="mt-0.5 block text-[10px] text-[#8fa0bb]">
                          {meta.country} · {meta.name}
                        </span>
                      </span>
                      {isActive ? (
                        <Check className="size-4 shrink-0 text-[#66a9ff]" aria-hidden />
                      ) : null}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
