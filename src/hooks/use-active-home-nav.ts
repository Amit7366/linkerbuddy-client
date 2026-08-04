"use client";

import { useEffect, useState } from "react";
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

function isHomeNavSection(value: string): value is HomeNavSection {
  return (HOME_NAV_SECTIONS as readonly string[]).includes(value);
}

function sectionFromHash(): HomeNavSection | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return isHomeNavSection(hash) ? hash : null;
}

/** Last section whose top has crossed the sticky-header marker. */
function sectionFromScroll(headerOffset: number): HomeNavSection | null {
  let current: HomeNavSection | null = null;

  for (const id of HOME_NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - headerOffset <= 0) {
      current = id;
    }
  }

  return current;
}

export function useActiveHomeNavSection() {
  const pathname = usePathname();
  const { pathname: bare } = stripLocalePrefix(pathname);
  const isHome = bare === "/";
  const pathActive = PATH_ACTIVE[bare] ?? null;
  const [active, setActive] = useState<HomeNavSection | null>(pathActive);

  useEffect(() => {
    if (!isHome) {
      setActive(pathActive);
      return;
    }

    const headerOffset = () => {
      const header = document.querySelector("header[role='banner']");
      return (header?.getBoundingClientRect().height ?? 74) + 12;
    };

    const sync = () => {
      const fromScroll = sectionFromScroll(headerOffset());
      setActive(fromScroll ?? sectionFromHash());
    };

    let scrolledForHash: string | null = null;

    const scrollHashIntoViewOnce = () => {
      const hash = sectionFromHash();
      if (!hash || scrolledForHash === hash) return false;
      const el = document.getElementById(hash);
      if (!el) return false;
      el.scrollIntoView();
      setActive(hash);
      scrolledForHash = hash;
      return true;
    };

    const onHashChange = () => {
      scrolledForHash = null;
      scrollHashIntoViewOnce();
      sync();
    };

    sync();
    scrollHashIntoViewOnce();

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", sync);

    // Home sections are dynamically imported; poll briefly as they mount.
    const poll = window.setInterval(() => {
      scrollHashIntoViewOnce();
      sync();
    }, 400);
    const stop = window.setTimeout(() => window.clearInterval(poll), 4000);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", sync);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [isHome, pathActive]);

  return { active, isHome, setActive };
}
