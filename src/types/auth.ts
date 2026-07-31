export type Role = "CUSTOMER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface AuthTokens {
  user: AuthUser;
  accessToken: string;
}
