"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { HomeNavSection } from "@/hooks/use-active-home-nav";
import { marketingMoreNav } from "@/config/nav";
import { stripLocalePrefix, withLocalePrefix } from "@/i18n/routing";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface NavMoreDropdownProps {
  homeHref: string;
  activeSection: HomeNavSection | null;
  pathname: string;
  fullWidth?: boolean;
  className?: string;
  onNavigate: (
    event: React.MouseEvent<HTMLAnchorElement>,
    section: HomeNavSection,
  ) => void;
  onClose?: () => void;
}

function isItemActive(
  item: (typeof marketingMoreNav)[number],
  activeSection: HomeNavSection | null,
  pathname: string,
) {
  if ("section" in item && item.section) {
    return activeSection === item.section;
  }

  const { pathname: bare } = stripLocalePrefix(pathname);
  if (item.href === "/blog") return bare === "/blog" || bare.startsWith("/blog/");
  return bare === item.href;
}

export function NavMoreDropdown({
  homeHref,
  activeSection,
  pathname,
  fullWidth = false,
  className,
  onNavigate,
  onClose,
}: NavMoreDropdownProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const listId = useId();
  const t = useTranslations();
  const { locale } = useLocale();

  const isActive = marketingMoreNav.some((item) =>
    isItemActive(item, activeSection, pathname),
  );

  const clearCloseTimer = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!fullWidth) return;
    setOpen(false);
  }, [fullWidth]);

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

  return (
    <div
      ref={rootRef}
      className={cn("relative", fullWidth && "w-full", className)}
      onMouseEnter={fullWidth ? undefined : openMenu}
      onMouseLeave={fullWidth ? undefined : scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "relative inline-flex items-center gap-1.5 border-0 bg-transparent font-semibold whitespace-nowrap transition-colors",
          fullWidth
            ? "min-h-11 w-full justify-between px-3 text-[14px]"
            : "text-[13px]",
          isActive
            ? "text-[var(--orange)] after:absolute after:right-0 after:-bottom-1 after:left-0 after:mx-auto after:h-[2px] after:w-4 after:rounded-full after:bg-[var(--orange)]"
            : open
              ? "text-white"
              : "text-[var(--nav-link)] hover:text-white",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        {t("nav.more")}
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
            role="menu"
            aria-label={t("nav.more")}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "z-[70] overflow-hidden rounded-xl border border-white/10 bg-navy p-1.5 shadow-[var(--shadow-overlay)]",
              fullWidth
                ? "relative mt-1 w-full"
                : "absolute top-[calc(100%+12px)] left-0 w-[220px]",
            )}
            onMouseEnter={fullWidth ? undefined : openMenu}
            onMouseLeave={fullWidth ? undefined : scheduleClose}
          >
            <ul className="m-0 list-none space-y-0.5 p-0">
              {marketingMoreNav.map((item, index) => {
                const itemActive = isItemActive(item, activeSection, pathname);
                const href = item.href.startsWith("#")
                  ? `${homeHref}${item.href}`
                  : withLocalePrefix(item.href, locale);
                const section =
                  "section" in item ? (item.section as HomeNavSection) : undefined;
                const showDivider = item.key === "nav.agencies";

                return (
                  <motion.li
                    key={item.key}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.03 * index, duration: 0.16 }}
                    className={showDivider ? "mb-1 border-b border-white/10 pb-1" : undefined}
                  >
                    <Link
                      role="menuitem"
                      href={href}
                      aria-current={itemActive ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center rounded-[10px] px-3 py-2.5 text-[13px] font-semibold no-underline transition-colors",
                        itemActive
                          ? "bg-brand/20 text-white"
                          : "text-white/80 hover:bg-white/8 hover:text-white",
                      )}
                      onClick={(event) => {
                        setOpen(false);
                        onClose?.();
                        if (section) onNavigate(event, section);
                      }}
                    >
                      {t(item.key)}
                    </Link>
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
