"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { MarketplaceDropdown } from "@/components/layout/marketplace-dropdown";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { useTranslations, useLocale } from "@/providers/locale-provider";
import { useSession } from "@/providers/session-provider";
import { profileHrefForRole } from "@/lib/auth/home";
import {
  useActiveHomeNavSection,
  type HomeNavSection,
} from "@/hooks/use-active-home-nav";
import { withLocalePrefix } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "nav.services", href: "#services", section: "services" },
  { key: "nav.agencies", href: "#agencies", section: "agencies" },
  { key: "nav.howItWorks", href: "#how-it-works", section: "how-it-works" },
  { key: "nav.pricing", href: "#pricing", section: "pricing" },
  { key: "nav.resources", href: "#faq", section: "faq" },
] as const satisfies ReadonlyArray<{
  key: string;
  href: `#${HomeNavSection}`;
  section: HomeNavSection;
}>;

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "U";
}

function ProfileNavLink({
  name,
  href,
  className,
  onClick,
}: {
  name: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex max-w-[180px] items-center gap-2 no-underline",
        className,
      )}
      title={name}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-bold text-white ring-1 ring-white/25">
        {userInitials(name)}
      </span>
      <span className="truncate text-[13px] font-semibold text-white">{name}</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const t = useTranslations();
  const { locale } = useLocale();
  const { user, loading } = useSession();
  const pathname = usePathname();
  const { active, isHome, setActive } = useActiveHomeNavSection();

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Account";
  const profileHref = profileHrefForRole(user?.role);
  const homeHref = withLocalePrefix("/", locale);

  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    section: HomeNavSection,
  ) => {
    setActive(section);
    setOpen(false);

    if (!isHome) return;

    event.preventDefault();
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `${pathname}#${section}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 h-[66px] border-b border-white/10 bg-[var(--header)] text-white backdrop-blur-[12px] phablet:h-[74px]"
      role="banner"
    >
      <Container className="flex h-full items-center justify-between gap-3">
        <Logo light />

        <nav
          className={cn(
            "items-center gap-[30px]",
            open
              ? "absolute top-[66px] right-0 left-0 z-[60] flex max-h-[calc(100dvh-66px)] flex-col items-stretch gap-4 overflow-y-auto bg-navy p-5 phablet:top-[74px] phablet:max-h-[calc(100dvh-74px)]"
              : "hidden tablet:flex",
          )}
          aria-label="Main navigation"
        >
          <MarketplaceDropdown
            fullWidth={open}
            active={active === "marketplace"}
            onSelect={(country) => {
              setOpen(false);
              setActive("marketplace");
              showToast(
                t("toast.marketplaceSelected", {
                  name: t(`marketplaceCountries.${country.code}.name`),
                }),
              );
            }}
          />

          {NAV_ITEMS.map((item) => {
            const isActive = active === item.section;
            return (
              <Link
                key={item.href}
                href={`${homeHref}${item.href}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative text-[13px] font-semibold no-underline transition-colors",
                  isActive
                    ? "text-[var(--orange)] after:absolute after:right-0 after:-bottom-1 after:left-0 after:mx-auto after:h-[2px] after:w-4 after:rounded-full after:bg-[var(--orange)]"
                    : "text-[var(--nav-link)] hover:text-white",
                )}
                onClick={(event) => handleNavClick(event, item.section)}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {open && !loading && user ? (
            <div className="mt-2 border-t border-white/10 pt-4 tablet:hidden">
              <ProfileNavLink
                name={displayName}
                href={profileHref}
                className="max-w-none"
                onClick={() => setOpen(false)}
              />
            </div>
          ) : null}
          {open && !loading && !user ? (
            <Link
              href="/login"
              className="mt-2 border-t border-white/10 pt-4 text-[13px] font-semibold text-[var(--nav-link)] no-underline hover:text-white tablet:hidden"
              onClick={() => setOpen(false)}
            >
              {t("common.signIn")}
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 phablet:gap-3">
          <LanguageSwitcher compact className="tablet:hidden" />
          <ThemeToggle className="tablet:hidden" />
          <div className="hidden items-center gap-2 tablet:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {!loading && user ? (
            <ProfileNavLink
              name={displayName}
              href={profileHref}
              className="hidden tablet:inline-flex"
            />
          ) : !loading ? (
            <Link
              href="/login"
              className="hidden text-[13px] font-semibold text-[var(--nav-link)] no-underline hover:text-white tablet:inline"
            >
              {t("common.signIn")}
            </Link>
          ) : null}

          <Button
            size="sm"
            className="hidden phablet:inline-flex"
            onClick={() => scrollTo("#custom-list")}
          >
            {t("common.getCustomList")}
          </Button>
          <button
            type="button"
            className="inline-flex border-0 bg-transparent text-[22px] text-white tablet:hidden"
            aria-label={t("common.toggleNav")}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <HiOutlineX aria-hidden /> : <HiOutlineMenuAlt3 aria-hidden />}
          </button>
        </div>
      </Container>
    </header>
  );
}
