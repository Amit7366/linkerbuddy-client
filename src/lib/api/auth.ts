import { apiClient, setAccessToken } from "./client";
import { endpoints } from "./endpoints";
import type { AuthTokens, AuthUser } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

/**
 * Auth cookie ops go through same-origin Next routes so the httpOnly
 * refreshToken is set on the app domain (required for middleware on Vercel).
 */
async function authBff<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!data.success) {
    throw new Error(data.error.message);
  }

  return data.data;
}

export async function login(email: string, password: string) {
  const data = await authBff<AuthTokens>("/api/auth/login", { email, password });
  setAccessToken(data.accessToken);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await authBff<AuthTokens>("/api/auth/register", {
    name,
    email,
    password,
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function refreshSession() {
  const data = await authBff<AuthTokens>("/api/auth/refresh");
  setAccessToken(data.accessToken);
  return data;
}

export async function logout() {
  await authBff<{ message: string }>("/api/auth/logout");
  setAccessToken(null);
}

export async function getMe() {
  return apiClient<AuthUser>(endpoints.users.me, { auth: true });
}
