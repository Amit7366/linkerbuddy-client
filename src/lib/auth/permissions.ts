import type { Role } from "@/types/auth";

export function canAccessCRM(role: Role): boolean {
  return role === "STAFF" || role === "ADMIN";
}

export function canAccessAccount(role: Role): boolean {
  return role === "CUSTOMER" || role === "STAFF" || role === "ADMIN";
}

export function canManageOrders(role: Role): boolean {
  return role === "STAFF" || role === "ADMIN";
}
