export type Role = "CUSTOMER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  phone?: string | null;
  company?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface AuthTokens {
  user: AuthUser;
  accessToken: string;
}
