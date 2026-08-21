"use client";

import { useEffect, type ReactNode, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { HiOutlineX } from "react-icons/hi";
import { useTranslations } from "@/providers/locale-provider";

const EASE = [0.22, 1, 0.36, 1] as const;
const DISMISS_OFFSET = 88;
const DISMISS_VELOCITY = 420;

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  closeRef: RefObject<HTMLButtonElement | null>;
}

export function MobileNavDrawer({
  open,
  onClose,
  label,
  children,
  footer,
  closeRef,
}: MobileNavDrawerProps) {
  const reduce = useReducedMotion();
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, closeRef]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > DISMISS_OFFSET || info.velocity.x > DISMISS_VELOCITY) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="mobile-nav-scrim"
            type="button"
            tabIndex={-1}
            aria-label={t("common.closeMenu")}
            className="fixed inset-0 z-[60] cursor-default border-0 bg-black/55 desktop:hidden"
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.2, ease: EASE }}
            onClick={onClose}
          />
          <motion.div
            key="mobile-nav-drawer"
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed top-0 right-0 z-[61] flex h-dvh w-[min(82vw,24rem)] flex-col overflow-hidden rounded-l-[28px] border-l border-white/10 bg-navy text-white shadow-[var(--shadow-overlay)] desktop:hidden"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0.18 : 0.32, ease: EASE }}
            drag={reduce ? false : "x"}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.42 }}
            onDragEnd={reduce ? undefined : onDragEnd}
          >
            <div className="flex shrink-0 flex-col px-5 pt-3">
              <span
                className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25"
                aria-hidden
              />
              <div className="flex items-center justify-between gap-3 pb-3">
                <p className="m-0 text-[13px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                  {t("common.menu")}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-white transition-colors hover:bg-white/16"
                  aria-label={t("common.closeMenu")}
                  onClick={onClose}
                >
                  <HiOutlineX className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            <nav
              className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 pt-1 [touch-action:pan-y]"
              aria-label={label}
            >
              {children}
            </nav>

            {footer ? (
              <div className="shrink-0 border-t border-white/10 bg-navy px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
