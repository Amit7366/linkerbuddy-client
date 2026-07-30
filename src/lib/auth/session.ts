import { getAccessToken } from "@/lib/api/client";

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}
