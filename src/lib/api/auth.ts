import { apiClient, setAccessToken } from "./client";
import { endpoints } from "./endpoints";
import type { AuthTokens, AuthUser } from "@/types/auth";

export async function login(email: string, password: string) {
  const data = await apiClient<AuthTokens>(endpoints.auth.login, {
    method: "POST",
    body: { email, password },
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await apiClient<AuthTokens>(endpoints.auth.register, {
    method: "POST",
    body: { name, email, password },
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function refreshSession() {
  const data = await apiClient<AuthTokens>(endpoints.auth.refresh, {
    method: "POST",
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function logout() {
  await apiClient<{ message: string }>(endpoints.auth.logout, {
    method: "POST",
  });
  setAccessToken(null);
}

export async function getMe() {
  return apiClient<AuthUser>(endpoints.users.me, { auth: true });
}
