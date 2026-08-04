"use client";

import { useCallback, useEffect, useState } from "react";
import {
  OrderDetailModal,
  OrderRowActions,
} from "@/components/account/order-detail-modal";
import { getMyOrders } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import {
  formatCents,
  statusBadgeClass,
  statusLabel,
} from "@/lib/orders-ui";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ label: string; value: OrderStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Complete", value: "COMPLETE" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "">("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders({
        limit: 100,
        status: filter || undefined,
      });
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">My orders</h1>
        <p className="mt-1 text-sm text-muted">
          Track every placement order, download invoices, and cancel while pending.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              filter === item.value
                ? "border-navy bg-navy text-white"
                : "border-line bg-card text-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-line bg-card shadow-sm">
        {loading ? (
          <p className="px-5 py-10 text-sm text-muted">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            No orders found for this filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-[11px] font-bold tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3.5 font-mono font-semibold text-ink">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {formatCents(order.totalCents, order.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                          statusBadgeClass(order.status),
                        )}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <OrderRowActions
                        order={order}
                        onView={setSelected}
                        showLabels
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailModal
        order={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onUpdated={(updated) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          setSelected(updated);
          void load();
        }}
      />
    </div>
  );
}
