"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: readonly AccordionItemData[];
  className?: string;
  defaultOpenIndex?: number | null;
}

export function Accordion({
  items,
  className,
  defaultOpenIndex = 0,
}: AccordionProps) {
  const { locale } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const reduce = useReducedMotion();
  const baseId = useId();

  useEffect(() => {
    setOpenIndex(defaultOpenIndex);
  }, [locale, defaultOpenIndex]);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className={cn("space-y-2.5", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={`${locale}-${item.question}`}
            className={cn(
              "rounded-[10px] border border-line bg-card px-[18px] transition-shadow",
              isOpen && "shadow-sm",
            )}
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-[18px] text-left text-[13px] font-bold text-ink"
                onClick={() => toggle(index)}
              >
                <span>{item.question}</span>
                <motion.span
                  className="inline-flex text-lg text-brand"
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                >
                  +
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="m-0 pb-[18px] text-[11px] leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
