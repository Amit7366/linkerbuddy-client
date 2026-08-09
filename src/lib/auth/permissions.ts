import type { Role } from "@/types/auth";

export function canAccessCRM(role: Role): boolean {
  return role === "STAFF" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canAccessAccount(role: Role): boolean {
  return role === "CUSTOMER" || role === "STAFF" || role === "ADMIN";
}

export function canManageOrders(role: Role): boolean {
  return role === "STAFF" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canAccessSuperAdmin(role: Role): boolean {
  return role === "SUPER_ADMIN";
}

export function canWriteMarketplace(role: Role): boolean {
  return role === "SUPER_ADMIN";
}
