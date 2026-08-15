"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/i18n/routing";

export const HOME_NAV_SECTIONS = [
  "marketplace",
  "services",
  "agencies",
  "how-it-works",
  "pricing",
  "faq",
] as const;

export type HomeNavSection = (typeof HOME_NAV_SECTIONS)[number];

const PATH_ACTIVE: Partial<Record<string, HomeNavSection>> = {
  "/pricing": "pricing",
  "/inventory": "marketplace",
};

const LOCK_MS = 1200;

function isHomeNavSection(value: string): value is HomeNavSection {
  return (HOME_NAV_SECTIONS as readonly string[]).includes(value);
}

function headerOffset() {
  const header = document.querySelector("header[role='banner']");
  return (header?.getBoundingClientRect().height ?? 74) + 10;
}

export function scrollToHomeSection(id: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

function sectionFromHash(): HomeNavSection | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return isHomeNavSection(hash) ? hash : null;
}

/** Section occupying the reading line just below the sticky header. */
function sectionFromScroll(): HomeNavSection | null {
  const spyY = headerOffset() + Math.min(96, Math.max(48, window.innerHeight * 0.18));

  const measured = HOME_NAV_SECTIONS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { id, top: rect.top, bottom: rect.bottom };
  })
    .filter((item): item is { id: HomeNavSection; top: number; bottom: number } => item !== null)
    .sort((a, b) => a.top - b.top);

  if (measured.length === 0) return null;

  const doc = document.documentElement;
  if (window.scrollY + window.innerHeight >= doc.scrollHeight - 64) {
    return measured[measured.length - 1]!.id;
  }

  const containing = measured.find((section) => section.top <= spyY && section.bottom > spyY);
  if (containing) return containing.id;

  let current: HomeNavSection | null = null;
  for (const section of measured) {
    if (section.top <= spyY) current = section.id;
  }
  return current;
}

export function useActiveHomeNavSection() {
  const pathname = usePathname();
  const { pathname: bare } = stripLocalePrefix(pathname);
  const isHome = bare === "/";
  const pathActive = PATH_ACTIVE[bare] ?? null;
  const [active, setActiveState] = useState<HomeNavSection | null>(pathActive);
  const lockRef = useRef<{ section: HomeNavSection | null; until: number }>({
    section: null,
    until: 0,
  });

  const setActive = useCallback((section: HomeNavSection | null) => {
    setActiveState(section);
    if (section) {
      lockRef.current = { section, until: performance.now() + LOCK_MS };
    } else {
      lockRef.current = { section: null, until: 0 };
    }
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveState(pathActive);
      lockRef.current = { section: null, until: 0 };
      return;
    }

    let frame = 0;
    let scrolledForHash: string | null = null;

    const sync = () => {
      const lock = lockRef.current;
      if (lock.section && performance.now() < lock.until) {
        setActiveState(lock.section);
        return;
      }
      lockRef.current = { section: null, until: 0 };
      setActiveState(sectionFromScroll());
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    const scrollHashIntoViewOnce = () => {
      const hash = sectionFromHash();
      if (!hash || scrolledForHash === hash) return false;
      if (!scrollToHomeSection(hash, "auto")) return false;
      setActive(hash);
      scrolledForHash = hash;
      return true;
    };

    const onHashChange = () => {
      scrolledForHash = null;
      const hash = sectionFromHash();
      if (hash) {
        scrollToHomeSection(hash);
        setActive(hash);
        return;
      }
      lockRef.current = { section: null, until: 0 };
      sync();
    };

    const onScrollEnd = () => {
      lockRef.current = { section: null, until: 0 };
      sync();
    };

    sync();
    scrollHashIntoViewOnce();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", onScroll);

    const poll = window.setInterval(() => {
      scrollHashIntoViewOnce();
      if (!(lockRef.current.section && performance.now() < lockRef.current.until)) {
        sync();
      }
    }, 400);
    const stop = window.setTimeout(() => window.clearInterval(poll), 4000);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [isHome, pathActive, setActive]);

  return { active, isHome, setActive, scrollToSection: scrollToHomeSection };
}
