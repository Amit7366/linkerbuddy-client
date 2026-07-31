"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api/client";
import { getMe, logout, refreshSession } from "@/lib/api/auth";
import { canAccessSuperAdmin } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";

interface SuperAdminAuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextValue | null>(
  null,
);

export function useSuperAdminAuth() {
  const ctx = useContext(SuperAdminAuthContext);
  if (!ctx) {
    throw new Error("useSuperAdminAuth must be used within SuperAdminShell");
  }
  return ctx;
}

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        if (!getAccessToken()) {
          await refreshSession();
        }
        const me = await getMe();
        if (cancelled) return;
        if (!canAccessSuperAdmin(me.role)) {
          router.replace("/account/settings/profile");
          return;
        }
        setUser(me);
      } catch {
        if (!cancelled) {
          const redirect = encodeURIComponent(
            pathname || "/dashboard/super-admin",
          );
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
    // Boot once on mount; pathname used only for redirect target
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore logout network errors
    }
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  );

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3d9a6a] border-t-transparent" />
      </div>
    );
  }

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
}
