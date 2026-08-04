"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clock3,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Settings,
  Star,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { getAccessToken } from "@/lib/api/client";
import { getMe, logout, refreshSession } from "@/lib/api/auth";
import { canAccessAccount } from "@/lib/auth/permissions";
import { siteConfig } from "@/config/site";
import {
  accountFooterNav,
  accountNav,
  accountQuickLinks,
} from "@/config/nav";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

interface AccountAuthContextValue {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AccountAuthContext = createContext<AccountAuthContextValue | null>(null);

export function useAccountAuth() {
  const ctx = useContext(AccountAuthContext);
  if (!ctx) {
    throw new Error("useAccountAuth must be used within AccountShell");
  }
  return ctx;
}

const NAV_ICONS = {
  overview: LayoutDashboard,
  orders: Package,
  reviews: Star,
  addresses: MapPin,
  recent: Clock3,
  favorites: Heart,
  settings: Settings,
} as const;

const QUICK_TONES = {
  profile: "bg-[#e8f0fe] text-brand",
  gifts: "bg-[#f3e8ff] text-[#7c3aed]",
  wallet: "bg-emerald-50 text-emerald-600",
} as const;

const QUICK_ICONS = {
  profile: UserRound,
  gifts: Gift,
  wallet: Wallet,
} as const;

function initials(user: AuthUser) {
  const base = user.name?.trim() || user.email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        if (!getAccessToken()) {
          await refreshSession();
        }
        const me = await getMe();
        if (cancelled) return;
        if (!canAccessAccount(me.role)) {
          router.replace("/login");
          return;
        }
        setUser(me);
      } catch {
        if (!cancelled) {
          const redirect = encodeURIComponent(pathname || "/account");
          router.replace(`/login?redirect=${redirect}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const refreshUser = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => (user ? { user, loading, signOut, refreshUser } : null),
    [user, loading, signOut, refreshUser],
  );

  if (loading || !user || !value) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const displayName = user.name?.trim() || user.email.split("@")[0] || "Account";

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/account") return pathname === "/account";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-5">
        <Link href="/" className="text-sm font-bold text-navy no-underline">
          {siteConfig.name}
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-navy text-sm font-bold text-white">
            {initials(user)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{displayName}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {accountQuickLinks.map((item) => {
            const Icon = QUICK_ICONS[item.tone];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-card px-2 py-3 text-center no-underline transition hover:border-brand/30"
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-lg",
                    QUICK_TONES[item.tone],
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="text-[11px] font-semibold text-ink">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Account">
        {accountNav.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isActive(item.href, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors",
                active
                  ? "bg-[#e8f0fe] font-semibold text-navy"
                  : "text-muted hover:bg-sky hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line px-3 py-4">
        {accountFooterNav.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors",
                active
                  ? "bg-[#e8f0fe] font-semibold text-navy"
                  : "text-muted hover:bg-sky hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="size-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <AccountAuthContext.Provider value={value}>
      <div className="min-h-screen bg-[var(--surface)]">
        <div className="mx-auto flex min-h-screen max-w-[1200px]">
          <aside className="hidden w-[280px] shrink-0 border-r border-line bg-card lg:block">
            {sidebar}
          </aside>

          {mobileOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-[280px] bg-card shadow-xl">
                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-2 text-muted hover:bg-sky"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                {sidebar}
              </aside>
            </div>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-ink hover:bg-sky"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">My account</p>
                <p className="truncate text-xs text-muted">{displayName}</p>
              </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AccountAuthContext.Provider>
  );
}
