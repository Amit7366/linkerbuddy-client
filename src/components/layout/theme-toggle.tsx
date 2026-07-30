"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[var(--nav-link)] transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white",
        className,
      )}
      aria-label={mounted ? (isDark ? t("common.themeLight") : t("common.themeDark")) : t("common.themeDark")}
      suppressHydrationWarning
      onClick={() => {
        if (!mounted) return;
        setTheme(isDark ? "light" : "dark");
      }}
    >
      {!mounted ? (
        <span className="size-4 rounded-full bg-white/20" aria-hidden />
      ) : isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
