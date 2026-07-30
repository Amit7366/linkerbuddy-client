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
  health: "/health",
} as const;
