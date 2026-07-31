"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/providers/locale-provider";
import { withLocalePrefix } from "@/i18n/routing";

interface LogoProps {
  href?: string;
  className?: string;
  light?: boolean;
}

export function Logo({ href, className, light = false }: LogoProps) {
  const { locale } = useLocale();
  const homeHref = href ?? withLocalePrefix("/", locale);

  return (
    <Link
      href={homeHref}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.5px] no-underline",
        light ? "text-white" : "text-navy",
        className,
      )}
    >
      <Image
        src="/brand/mark.svg"
        alt=""
        width={35}
        height={35}
        className="-rotate-12"
        priority
        unoptimized
      />
      <span className="flex flex-col leading-none">
        <span>
          Linker
          <span className={light ? "text-[var(--logo-accent)]" : "text-brand"}>buddy</span>
        </span>
        <small
          className={cn(
            "mt-px block text-[8px] font-semibold uppercase tracking-[1.25px]",
            light ? "text-[#9fb0ca]" : "text-muted",
          )}
        >
          {siteConfig.tagline}
        </small>
      </span>
    </Link>
  );
}
