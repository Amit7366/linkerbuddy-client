"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AuthFormPanel } from "@/components/forms/auth-forms";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { Logo } from "@/components/ui/logo";
import { useSession } from "@/providers/session-provider";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "register";

interface AuthShellProps {
  mode: AuthMode;
}

function accountHomeForRole(role?: string) {
  if (role === "SUPER_ADMIN") return "/dashboard/super-admin";
  return "/account";
}

function AuthShellInner({ mode }: AuthShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const { user, loading } = useSession();

  useEffect(() => {
    if (loading || !user) return;
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      router.replace(redirect);
      return;
    }
    router.replace(accountHomeForRole(user.role));
  }, [loading, user, router, searchParams]);

  function switchMode(next: AuthMode) {
    if (next === mode) return;
    const redirect = searchParams.get("redirect");
    const qs = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
    router.replace(next === "login" ? `/login${qs}` : `/register${qs}`);
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
        {user ? "Redirecting…" : "Checking session…"}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative flex w-full flex-col bg-card lg:w-[55%]">
        <div className="flex items-center justify-between px-6 pt-6 phablet:px-10 phablet:pt-8">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink no-underline transition-colors hover:bg-sky"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <Logo className="scale-90" />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10 phablet:px-10">
          <div
            role="tablist"
            aria-label="Authentication"
            className="relative mb-8 grid grid-cols-2 rounded-full bg-sky p-1"
          >
            {(
              [
                { id: "login", label: "Sign In" },
                { id: "register", label: "Register" },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchMode(tab.id)}
                  className={cn(
                    "relative z-10 rounded-full border-0 bg-transparent py-2.5 text-[13px] font-bold transition-colors",
                    active ? "text-white" : "text-muted hover:text-ink",
                    reduce && active && "bg-brand shadow-[var(--shadow-btn)]",
                  )}
                >
                  {active && !reduce && (
                    <motion.span
                      layoutId="auth-tab-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand shadow-[var(--shadow-btn)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AuthFormPanel mode={mode} />
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}

export function AuthShell({ mode }: AuthShellProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted">
          Loading…
        </div>
      }
    >
      <AuthShellInner mode={mode} />
    </Suspense>
  );
}
