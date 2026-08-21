"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { MarketplaceDropdown } from "@/components/layout/marketplace-dropdown";
import { NavMoreDropdown } from "@/components/layout/nav-more-dropdown";
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
import { marketingAboutItem, marketingPrimaryNav } from "@/config/nav";
import { stripLocalePrefix, withLocalePrefix } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "U";
}

function resolveNavHref(href: string, homeHref: string, locale: Locale) {
  if (href.startsWith("#")) return `${homeHref}${href}`;
  return withLocalePrefix(href, locale);
}

function isPagePathActive(pathname: string, href: string) {
  const { pathname: bare } = stripLocalePrefix(pathname);
  if (href === "/blog") return bare === "/blog" || bare.startsWith("/blog/");
  return bare === href;
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
  const [authReady, setAuthReady] = useState(false);
  const { showToast } = useToast();
  const t = useTranslations();
  const { locale } = useLocale();
  const { user, loading } = useSession();
  const pathname = usePathname();
  const { active, isHome, setActive, scrollToSection } = useActiveHomeNavSection();

  // Avoid auth-dependent HTML differing between SSR and the first client paint.
  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 80rem)");
    const closeOnDesktop = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", closeOnDesktop);
    return () => mq.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Account";
  const profileHref = profileHrefForRole(user?.role);
  const homeHref = withLocalePrefix("/", locale);
  const showAuth = authReady && !loading;

  const scrollTo = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  const handleHashNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    section: HomeNavSection,
  ) => {
    setActive(section);
    setOpen(false);

    if (!isHome) return;

    event.preventDefault();
    const el = document.getElementById(section);
    if (el) {
      scrollToSection(section);
      window.history.replaceState(null, "", `${pathname}#${section}`);
    }
  };

  const navLinkClass = (isActive: boolean) =>
    cn(
      "relative whitespace-nowrap text-[13px] font-semibold no-underline transition-colors",
      isActive
        ? "text-[var(--orange)] after:absolute after:right-0 after:-bottom-1 after:left-0 after:mx-auto after:h-[2px] after:w-4 after:rounded-full after:bg-[var(--orange)]"
        : "text-[var(--nav-link)] hover:text-white",
    );

  const mobileLinkClass = (isActive: boolean) =>
    cn(
      "flex min-h-11 items-center rounded-lg px-3 text-[14px] font-semibold no-underline transition-colors",
      isActive
        ? "bg-white/10 text-white"
        : "text-[var(--nav-link)] hover:bg-white/6 hover:text-white",
    );

  const renderHashOrPageLink = (
    item: { key: string; href: string; section?: string },
    variant: "desktop" | "mobile",
  ) => {
    const href = resolveNavHref(item.href, homeHref, locale);
    const section = item.section as HomeNavSection | undefined;
    const isActive = section
      ? active === section
      : isPagePathActive(pathname, item.href);
    const className = variant === "desktop" ? navLinkClass(isActive) : mobileLinkClass(isActive);

    return (
      <Link
        key={item.key}
        href={href}
        aria-current={isActive ? "true" : undefined}
        className={className}
        onClick={(event) => {
          if (section) {
            handleHashNav(event, section);
            return;
          }
          setOpen(false);
        }}
      >
        {t(item.key)}
      </Link>
    );
  };

  const navLinks = (variant: "desktop" | "mobile") => (
    <>
      {renderHashOrPageLink(marketingAboutItem, variant)}

      <MarketplaceDropdown
        fullWidth={variant === "mobile"}
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

      {marketingPrimaryNav.map((item) => renderHashOrPageLink(item, variant))}

      <NavMoreDropdown
        homeHref={homeHref}
        activeSection={active}
        pathname={pathname}
        fullWidth={variant === "mobile"}
        onNavigate={handleHashNav}
        onClose={() => setOpen(false)}
      />
    </>
  );

  return (
    <>
      <header
        className="sticky top-0 z-50 h-[66px] border-b border-white/10 bg-[var(--header)] text-white backdrop-blur-[12px] phablet:h-[74px]"
        role="banner"
      >
        <Container className="flex h-full items-center justify-between gap-3">
          <Logo light className="min-w-0" />

          <nav
            className="hidden items-center gap-4 desktop:flex desktop:gap-6"
            aria-label="Main navigation"
          >
            {navLinks("desktop")}
          </nav>

          <div className="flex shrink-0 items-center gap-2 phablet:gap-3">
            <LanguageSwitcher />
            <ThemeToggle className="desktop:hidden" />
            <div className="hidden items-center gap-2 desktop:flex">
              <ThemeToggle />
            </div>

            {!showAuth ? (
              <span className="hidden h-8 w-[4.5rem] desktop:inline-block" aria-hidden />
            ) : user ? (
              <ProfileNavLink
                name={displayName}
                href={profileHref}
                className="hidden desktop:inline-flex"
              />
            ) : (
              <Link
                href="/login"
                className="hidden text-[13px] font-semibold text-[var(--nav-link)] no-underline hover:text-white desktop:inline"
              >
                {t("common.signIn")}
              </Link>
            )}

            <Button
              size="sm"
              variant="light"
              className="hidden phablet:inline-flex"
              onClick={() => scrollTo("custom-list")}
            >
              {t("common.getCustomList")}
            </Button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center border-0 bg-transparent text-[22px] text-white desktop:hidden"
              aria-label={t("common.toggleNav")}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <HiOutlineX aria-hidden /> : <HiOutlineMenuAlt3 aria-hidden />}
            </button>
          </div>
        </Container>
      </header>

      {open ? (
        <nav
          className="fixed top-[66px] right-0 bottom-0 left-0 z-[60] flex flex-col items-stretch gap-1 overflow-y-auto overscroll-contain bg-navy px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] phablet:top-[74px] phablet:px-6 desktop:hidden"
          aria-label="Main navigation"
        >
          {navLinks("mobile")}

          <div className="mt-3 border-t border-white/10 pt-4">
            <Button
              size="sm"
              variant="light"
              className="w-full"
              onClick={() => scrollTo("custom-list")}
            >
              {t("common.getCustomList")}
            </Button>
          </div>

          {showAuth && user ? (
            <div className="border-t border-white/10 pt-4">
              <ProfileNavLink
                name={displayName}
                href={profileHref}
                className="max-w-none"
                onClick={() => setOpen(false)}
              />
            </div>
          ) : null}
          {showAuth && !user ? (
            <Link
              href="/login"
              className="border-t border-white/10 pt-4 text-[13px] font-semibold text-[var(--nav-link)] no-underline hover:text-white"
              onClick={() => setOpen(false)}
            >
              {t("common.signIn")}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
