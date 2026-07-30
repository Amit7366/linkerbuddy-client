import type { Role } from "@/types/auth";

export function isRoleAllowed(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
