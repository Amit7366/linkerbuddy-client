"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  listAdminOrders,
  updateOrderStatus,
  updateAdminOrder,
} from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import {
  allowedNextStatuses,
  formatCents,
  paymentLabel,
  statusLabel,
} from "@/lib/orders-ui";
import { OrderTimeline } from "@/components/orders/order-timeline";
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [editBilling, setEditBilling] = useState({
    billingName: "",
    billingPhone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: "",
  });

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

  function openOrder(order: Order) {
    setSelected(order);
    setEditBilling({
      billingName: order.billingName,
      billingPhone: order.billingPhone,
      addressLine1: order.addressLine1,
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
      country: order.country,
      notes: order.notes ?? "",
    });
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

  async function saveEdits() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminOrder(selected.id, {
        ...editBilling,
        notes: editBilling.notes || null,
      });
      setSelected(updated);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const locked =
    selected?.status === "COMPLETE" ||
    selected?.status === "REJECTED" ||
    selected?.status === "CANCELLED";
  const nextStatuses = selected ? allowedNextStatuses(selected.status) : [];

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  Manage order
                </p>
                <h2 className="mt-1 font-mono text-xl font-bold text-zinc-900">
                  {selected.orderNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Status timeline</h3>
                <OrderTimeline status={selected.status} events={selected.statusEvents} />
                {nextStatuses.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {nextStatuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={saving}
                        onClick={() => void changeStatus(s)}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-semibold text-white",
                          s === "REJECTED" || s === "FAILED"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-[#1a3d2e] hover:bg-[#245240]",
                        )}
                      >
                        Mark {statusLabel(s)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">
                    No further status changes available.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Items</h3>
                  <ul className="mt-2 space-y-2">
                    {selected.items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      >
                        <p className="font-semibold">{item.domain}</p>
                        <p className="text-xs text-zinc-500">
                          {item.serviceType} × {item.quantity} —{" "}
                          {formatCents(item.lineTotalCents)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Edit billing</h3>
                  {locked ? (
                    <p className="mt-2 text-xs text-amber-700">
                      {selected.status === "COMPLETE"
                        ? "Completed orders are locked."
                        : "This order is locked until reset to Pending."}
                    </p>
                  ) : null}
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["billingName", "Name"],
                        ["billingPhone", "Phone"],
                        ["addressLine1", "Address"],
                        ["city", "City"],
                        ["state", "State"],
                        ["postalCode", "Postal"],
                        ["country", "Country"],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="block text-xs text-zinc-500">
                        {label}
                        <input
                          disabled={locked || saving}
                          className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm text-zinc-900 disabled:bg-zinc-50"
                          value={editBilling[key]}
                          onChange={(e) =>
                            setEditBilling((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                        />
                      </label>
                    ))}
                    <label className="block text-xs text-zinc-500 sm:col-span-2">
                      Notes
                      <textarea
                        disabled={locked || saving}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm disabled:bg-zinc-50"
                        value={editBilling.notes}
                        onChange={(e) =>
                          setEditBilling((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  {!locked ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void saveEdits()}
                      className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
