import { apiClient } from "./client";
import { endpoints } from "./endpoints";
import type {
  CheckoutIntentPayload,
  CheckoutIntentResponse,
  Order,
  OrderStatus,
  OrdersListResponse,
} from "@/types/order";

export async function createCheckoutIntent(payload: CheckoutIntentPayload) {
  return apiClient<CheckoutIntentResponse>(endpoints.orders.checkoutIntent, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function getMyOrders(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return apiClient<OrdersListResponse>(
    `${endpoints.orders.me}${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export async function getMyOrder(id: string) {
  return apiClient<Order>(endpoints.orders.meDetail(id), { auth: true });
}

export async function confirmMyOrderPayment(id: string) {
  return apiClient<Order>(endpoints.orders.confirmPayment(id), {
    method: "POST",
    auth: true,
  });
}

export async function cancelMyOrder(id: string) {
  return apiClient<Order>(endpoints.orders.cancel(id), {
    method: "POST",
    auth: true,
  });
}

export async function listAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return apiClient<OrdersListResponse>(
    `${endpoints.orders.list}${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export async function getAdminOrder(id: string) {
  return apiClient<Order>(endpoints.orders.detail(id), { auth: true });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
) {
  return apiClient<Order>(endpoints.orders.status(id), {
    method: "PATCH",
    body: { status, note },
    auth: true,
  });
}

export async function updateAdminOrder(
  id: string,
  body: Record<string, unknown>,
) {
  return apiClient<Order>(endpoints.orders.detail(id), {
    method: "PATCH",
    body,
    auth: true,
  });
}

/** @deprecated stub compatibility */
export async function getOrders() {
  const data = await getMyOrders({ limit: 50 });
  return data.orders;
}
