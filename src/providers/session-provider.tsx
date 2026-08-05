"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getAccessToken, setAccessToken } from "@/lib/api/client";
import { getMe, logout as apiLogout, refreshSession } from "@/lib/api/auth";
import type { AuthUser } from "@/types/auth";

const SESSION_STARTED_KEY = "lb_session_started_at";
/** Max session lifetime before forced logout */
export const SESSION_MAX_MS = 2 * 60 * 60 * 1000;

interface SessionContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  /** Call after login/register to start the 2h window and set user */
  establishSession: (user: AuthUser) => void;
  refreshUser: () => Promise<AuthUser | null>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function readSessionStarted(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STARTED_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function writeSessionStarted(ts = Date.now()) {
  localStorage.setItem(SESSION_STARTED_KEY, String(ts));
}

function clearSessionStarted() {
  localStorage.removeItem(SESSION_STARTED_KEY);
}

function isSessionExpired(startedAt: number | null) {
  if (!startedAt) return false;
  return Date.now() - startedAt >= SESSION_MAX_MS;
}

async function probeHasSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/status", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { hasSession?: boolean };
    return Boolean(data.hasSession);
  } catch {
    return false;
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const signingOut = useRef(false);
  const bootGeneration = useRef(0);

  const signOut = useCallback(async () => {
    if (signingOut.current) return;
    signingOut.current = true;
    try {
      await apiLogout().catch(() => null);
    } finally {
      setAccessToken(null);
      clearSessionStarted();
      setUser(null);
      signingOut.current = false;
    }
  }, []);

  const establishSession = useCallback((next: AuthUser) => {
    writeSessionStarted(Date.now());
    setUser(next);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (!getAccessToken()) {
        const hasSession = await probeHasSession();
        if (!hasSession) {
          setAccessToken(null);
          setUser(null);
          return null;
        }
        await refreshSession();
      }
      const me = await getMe();
      setUser(me);
      if (!readSessionStarted()) {
        writeSessionStarted(Date.now());
      }
      return me;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const generation = ++bootGeneration.current;
    let cancelled = false;

    async function boot() {
      try {
        const started = readSessionStarted();

        // Soft-expire client window: try cookie refresh first; only hard-logout if refresh fails
        if (isSessionExpired(started)) {
          clearSessionStarted();
        }

        if (!getAccessToken()) {
          const hasSession = await probeHasSession();
          if (cancelled || generation !== bootGeneration.current) return;

          if (!hasSession) {
            setUser(null);
            return;
          }

          await refreshSession();
          if (cancelled || generation !== bootGeneration.current) return;
        }

        const me = await getMe();
        if (cancelled || generation !== bootGeneration.current) return;

        if (!readSessionStarted()) {
          writeSessionStarted(Date.now());
        }
        setUser(me);
      } catch {
        if (!cancelled && generation === bootGeneration.current) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled && generation === bootGeneration.current) {
          setLoading(false);
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-logout when 2h session window ends
  useEffect(() => {
    if (!user) return;

    const check = () => {
      const started = readSessionStarted();
      if (isSessionExpired(started)) {
        void signOut();
      }
    };

    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, [user, signOut]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signOut,
      establishSession,
      refreshUser,
    }),
    [user, loading, signOut, establishSession, refreshUser],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}

/** Safe for components that may render outside SessionProvider */
export function useSessionOptional() {
  return useContext(SessionContext);
}
