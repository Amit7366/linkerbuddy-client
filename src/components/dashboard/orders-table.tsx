"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  listAdminOrders,
  updateOrderStatus,
  updateAdminOrder,
} from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import {
  formatCents,
  paymentLabel,
  statusLabel,
} from "@/lib/orders-ui";
import { OrderManageModal } from "@/components/dashboard/order-manage-modal";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

const ALL_STATUSES: Array<OrderStatus | ""> = [
  "",
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERING",
  "COMPLETE",
  "FAILED",
  "REJECTED",
  "CANCELLED",
];

function statusTone(status: Order["status"]) {
  if (status === "COMPLETE") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED" || status === "FAILED" || status === "CANCELLED")
    return "bg-red-50 text-red-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-800";
  return "bg-sky-50 text-sky-800";
}

export function OrdersTable() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading orders…</p>}>
      <OrdersTableInner />
    </Suspense>
  );
}

function OrdersTableInner() {
  const searchParams = useSearchParams();
  const deepLink = searchParams.get("order")?.trim() ?? "";
  const openedRef = useRef<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(deepLink);
  const [search, setSearch] = useState(deepLink);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminOrders({
        page,
        limit: PAGE_SIZE,
        q: search || undefined,
        status: status || undefined,
      });
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!deepLink || loading || openedRef.current === deepLink) return;
    const match = orders.find(
      (order) => order.orderNumber === deepLink || order.id === deepLink,
    );
    if (!match) return;
    openedRef.current = deepLink;
    setSelected(match);
  }, [deepLink, loading, orders]);

  function openOrder(order: Order) {
    setSelected(order);
  }

  async function changeStatus(next: OrderStatus) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateOrderStatus(selected.id, next);
      setSelected(updated);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdits(payload: Record<string, unknown>) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminOrder(selected.id, payload);
      setSelected(updated);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1 sm:max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(q.trim());
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order #, email, name…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pr-3 pl-9 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          />
        </form>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as OrderStatus | "");
          }}
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s || "all"} value={s}>
              {s ? statusLabel(s) : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50"
                    onClick={() => openOrder(order)}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">{order.billingName}</p>
                      <p className="text-xs text-zinc-500">{order.billingEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          statusTone(order.status),
                        )}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {paymentLabel(order.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCents(order.totalCents, order.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>
          {total} order{total === 1 ? "" : "s"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1.5">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {selected ? (
        <OrderManageModal
          order={selected}
          saving={saving}
          onClose={() => setSelected(null)}
          onStatus={(status) => void changeStatus(status)}
          onSave={saveEdits}
        />
      ) : null}
    </div>
  );
}
