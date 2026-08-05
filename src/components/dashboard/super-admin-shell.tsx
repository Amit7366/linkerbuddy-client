"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessSuperAdmin } from "@/lib/auth/permissions";
import { useSession } from "@/providers/session-provider";
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
  const {
    user,
    loading,
    signOut: sessionSignOut,
  } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const redirect = encodeURIComponent(pathname || "/dashboard/super-admin");
      router.replace(`/login?redirect=${redirect}`);
      return;
    }
    if (!canAccessSuperAdmin(user.role)) {
      router.replace("/account/settings/profile");
    }
  }, [loading, user, pathname, router]);

  const signOut = useCallback(async () => {
    await sessionSignOut();
    router.replace("/login");
  }, [sessionSignOut, router]);

  const value = useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut],
  );

  if (loading || !user || !canAccessSuperAdmin(user.role)) {
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
