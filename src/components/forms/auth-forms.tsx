"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { login, register } from "@/lib/api/auth";
import { useSession } from "@/providers/session-provider";

const ease = [0.22, 1, 0.36, 1] as const;

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((password) => /[a-z]/.test(password) && /[A-Z]/.test(password), {
        message: "Password must include lowercase and uppercase letters",
      })
      .refine((password) => /[^A-Za-z]/.test(password), {
        message: "Password must include a number or symbol",
      }),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function passwordChecks(password: string) {
  let hasLower = false;
  let hasUpper = false;
  let hasNumberOrSymbol = false;

  for (const char of password) {
    if (char >= "a" && char <= "z") {
      hasLower = true;
    } else if (char >= "A" && char <= "Z") {
      hasUpper = true;
    } else {
      // digit, punctuation, symbol, or other non-letter
      hasNumberOrSymbol = true;
    }
  }

  return {
    hasMinLength: password.length >= 8,
    hasNumberOrSymbol,
    hasMixedCase: hasLower && hasUpper,
  };
}

function isEmailValid(email: string) {
  return z.string().email().safeParse(email).success;
}

function safeRedirect(raw: string | null, role?: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    if (role === "SUPER_ADMIN") return "/dashboard/super-admin";
    return "/account";
  }
  if (raw.startsWith("/dashboard")) {
    return role === "SUPER_ADMIN" ? raw : "/account";
  }
  return raw;
}

interface AuthFieldProps {
  id: string;
  type?: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  valid?: boolean;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
}

function AuthField({
  id,
  type = "text",
  value,
  placeholder,
  icon,
  valid,
  showPasswordToggle,
  autoComplete,
  onChange,
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const inputType = showPasswordToggle ? (revealed ? "text" : "password") : type;

  function emitValue(next: string) {
    onChange(next);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b pb-2.5 transition-colors duration-200",
        focused ? "border-[var(--orange)]" : "border-line",
      )}
    >
      <span className="shrink-0 text-muted">{icon}</span>
      <input
        id={id}
        type={inputType}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => emitValue(e.target.value)}
        onKeyUp={(e) => emitValue((e.target as HTMLInputElement).value)}
        className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted/70"
      />
      {showPasswordToggle && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={revealed ? "Hide password" : "Show password"}
          className="shrink-0 border-0 bg-transparent p-0 text-muted hover:text-ink"
          onClick={() => setRevealed((v) => !v)}
        >
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
      {valid && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

function PasswordChecklist({ password }: { password: string }) {
  const checks = passwordChecks(password);
  const items = [
    { key: "hasMinLength", label: "At least 8 characters", ok: checks.hasMinLength },
    {
      key: "hasNumberOrSymbol",
      label: "At least one number (0-9) or a symbol",
      ok: checks.hasNumberOrSymbol,
    },
    {
      key: "hasMixedCase",
      label: "Lowercase (a-z) and uppercase (A-Z)",
      ok: checks.hasMixedCase,
    },
  ] as const;

  return (
    <ul className="mt-3 space-y-1.5" aria-live="polite">
      {items.map((item) => (
        <li
          key={item.key}
          className={cn(
            "flex items-center gap-2 text-[12px] font-medium transition-colors duration-150",
            item.ok ? "text-green" : "text-muted",
          )}
        >
          {item.ok ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-green" strokeWidth={2.5} />
          ) : (
            <span className="mx-1 h-1 w-1 shrink-0 rounded-full bg-current" />
          )}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function SubmitButton({
  loading,
  disabled,
  label,
  loadingLabel,
}: {
  loading: boolean;
  disabled?: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "group flex w-full items-center justify-between rounded-full bg-brand px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-btn)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:bg-brand-hover",
        "disabled:pointer-events-none disabled:opacity-55",
      )}
    >
      <span>{loading ? loadingLabel : label}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { establishSession } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = form.email.length > 0 && isEmailValid(form.email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    setLoading(true);
    try {
      const data = await login(parsed.data.email, parsed.data.password);
      establishSession(data.user);
      router.push(safeRedirect(searchParams.get("redirect"), data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthField
        id="login-email"
        type="email"
        value={form.email}
        placeholder="Email"
        icon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        valid={emailValid}
        onChange={(email) => setForm((f) => ({ ...f, email }))}
      />
      <AuthField
        id="login-password"
        value={form.password}
        placeholder="Password"
        icon={<Lock className="h-4 w-4" />}
        autoComplete="current-password"
        showPasswordToggle
        onChange={(password) => setForm((f) => ({ ...f, password }))}
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-[12px] font-medium text-muted no-underline hover:text-brand"
        >
          Forgot password?
        </Link>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <SubmitButton
        loading={loading}
        label="Sign In"
        loadingLabel="Signing in..."
      />
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { establishSession } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => passwordChecks(form.password), [form.password]);
  const allChecksPass =
    checks.hasMinLength && checks.hasNumberOrSymbol && checks.hasMixedCase;
  const nameValid = form.name.trim().length > 0;
  const emailValid = form.email.length > 0 && isEmailValid(form.email);
  const confirmValid =
    form.confirmPassword.length > 0 && form.confirmPassword === form.password;
  const canSubmit = nameValid && emailValid && allChecksPass && confirmValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    if (!allChecksPass) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    try {
      const data = await register(parsed.data.name, parsed.data.email, parsed.data.password);
      establishSession(data.user);
      router.push(safeRedirect(searchParams.get("redirect"), data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField
        id="register-name"
        value={form.name}
        placeholder="Full name"
        icon={<User className="h-4 w-4" />}
        autoComplete="name"
        valid={nameValid}
        onChange={(name) => setForm((f) => ({ ...f, name }))}
      />
      <AuthField
        id="register-email"
        type="email"
        value={form.email}
        placeholder="Email"
        icon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        valid={emailValid}
        onChange={(email) => setForm((f) => ({ ...f, email }))}
      />
      <div>
        <AuthField
          id="register-password"
          value={form.password}
          placeholder="Password"
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          showPasswordToggle
          onChange={(password) => setForm((f) => ({ ...f, password }))}
        />
        <PasswordChecklist password={form.password} />
      </div>
      <AuthField
        id="register-confirm"
        value={form.confirmPassword}
        placeholder="Re-type password"
        icon={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
        showPasswordToggle
        valid={confirmValid}
        onChange={(confirmPassword) => setForm((f) => ({ ...f, confirmPassword }))}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <SubmitButton
        loading={loading}
        disabled={!canSubmit}
        label="Sign Up"
        loadingLabel="Creating account..."
      />
    </form>
  );
}

export function AuthFormPanel({ mode }: { mode: "login" | "register" }) {
  const reduce = useReducedMotion();

  const copy =
    mode === "login"
      ? {
          title: "Sign In",
          subtitle: "Welcome back — pick up where you left off on Linkerbuddy.",
        }
      : {
          title: "Sign Up",
          subtitle: "Secure your placements pipeline with Linkerbuddy.",
        };

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={reduce ? false : { opacity: 0, x: mode === "login" ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: mode === "login" ? 16 : -16 }}
          transition={{ duration: 0.28, ease }}
        >
          <h1 className="text-[34px] font-bold tracking-[-1.4px] text-ink phablet:text-[40px]">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">
            {copy.subtitle}
          </p>
          <div className="mt-8">
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
