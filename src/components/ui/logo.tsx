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
        "flex items-center gap-2.5 no-underline",
        light ? "text-white" : "text-navy",
        className,
      )}
    >
      <Image
        src={siteConfig.mark}
        alt=""
        width={35}
        height={35}
        className="size-[35px] object-contain"
        priority
        unoptimized
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-logo text-[17px] font-extrabold uppercase tracking-[-0.04em] whitespace-nowrap phablet:text-[20px]">
          Linker
          <span className={light ? "text-[#F00E58]" : "text-brand"}>buddy</span>
        </span>
        <small
          className={cn(
            "mt-px hidden text-[8px] font-semibold uppercase tracking-[1.25px] min-[380px]:block",
            light ? "text-[#9fb0ca]" : "text-muted",
          )}
        >
          {siteConfig.tagline}
        </small>
      </span>
    </Link>
  );
}
