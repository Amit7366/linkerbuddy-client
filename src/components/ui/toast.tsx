"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ToastContextValue {
  message: string | null;
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((next: string) => {
    setMessage(next);
    window.setTimeout(() => setMessage(null), 2800);
  }, []);

  const value = useMemo(() => ({ message, showToast }), [message, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-[90px] left-1/2 z-[100] -translate-x-1/2 rounded-[9px] bg-[#0b906a] px-[18px] py-3 text-xs font-bold text-white shadow-[0_10px_30px_#08433240] transition-all duration-300 ${
          message
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-5 opacity-0"
        }`}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
