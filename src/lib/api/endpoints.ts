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
  orders: {
    checkoutIntent: "/orders/checkout-intent",
    me: "/orders/me",
    meDetail: (id: string) => `/orders/me/${id}`,
    confirmPayment: (id: string) => `/orders/me/${id}/confirm-payment`,
    cancel: (id: string) => `/orders/me/${id}/cancel`,
    list: "/orders",
    detail: (id: string) => `/orders/${id}`,
    status: (id: string) => `/orders/${id}/status`,
  },
  health: "/health",
} as const;
