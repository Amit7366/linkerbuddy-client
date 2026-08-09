import type { Role } from "@/types/auth";

export const SUPER_ADMIN_HOME = "/dashboard/super-admin";
export const ACCOUNT_HOME = "/account";

export function homeForRole(role?: string): string {
  if (role === "SUPER_ADMIN") return SUPER_ADMIN_HOME;
  return ACCOUNT_HOME;
}

/**
 * Resolve post-login (or already-logged-in) redirect with role guards.
 * SUPER_ADMIN never lands on /account; non–SUPER_ADMIN never lands on /dashboard.
 */
export function safeRedirectForRole(raw: string | null, role?: string): string {
  const home = homeForRole(role);

  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return home;
  }

  if (role === "SUPER_ADMIN") {
    if (raw === ACCOUNT_HOME || raw.startsWith(`${ACCOUNT_HOME}/`)) {
      return SUPER_ADMIN_HOME;
    }
    if (raw.startsWith("/dashboard")) {
      return raw;
    }
    return SUPER_ADMIN_HOME;
  }

  if (raw.startsWith("/dashboard")) {
    return ACCOUNT_HOME;
  }

  return raw;
}

export function profileHrefForRole(role?: Role | string): string {
  return homeForRole(role);
}
