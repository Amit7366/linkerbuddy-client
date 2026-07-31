export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    me: "/users/me",
  },
  leads: {
    create: "/leads",
    list: "/leads",
  },
  marketplace: {
    list: "/marketplace",
    stats: "/marketplace/stats",
    detail: (id: number | string) => `/marketplace/${id}`,
  },
  health: "/health",
} as const;
