"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Package,
  Rocket,
  Star,
  Undo2,
} from "lucide-react";
import { useAccountAuth } from "@/components/account/account-shell";
import {
  OrderDetailModal,
  OrderRowActions,
} from "@/components/account/order-detail-modal";
import { getMyOrders } from "@/lib/api/orders";
import { getMyReviews } from "@/lib/api/reviews";
import { getBillingProfile } from "@/lib/api/users";
import type { BillingProfile } from "@/types/order";
import type { Order } from "@/types/order";
import {
  ACTIVE_ORDER_STATUSES,
  formatCents,
  statusBadgeClass,
  statusLabel,
} from "@/lib/orders-ui";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "U";
}

export default function AccountOverviewPage() {
  const { user } = useAccountAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersData, billing, reviewsData] = await Promise.all([
        getMyOrders({ limit: 100 }),
        getBillingProfile().catch(() => null),
        getMyReviews().catch(() => null),
      ]);
      setOrders(ordersData.orders);
      setProfile(billing);
      setReviewCount(reviewsData?.reviewCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activeOrders = useMemo(
    () => orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)),
    [orders],
  );

  const cancelledCount = orders.filter(
    (o) => o.status === "CANCELLED" || o.status === "REJECTED",
  ).length;

  const displayName = user.name?.trim() || user.email.split("@")[0] || "Customer";
  const phone = profile?.phone || "—";
  const address = profile
    ? [profile.addressLine1, profile.city, profile.country].filter(Boolean).join(", ") ||
      "—"
    : "—";

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "—" : String(orders.length),
      icon: Package,
      tone: "bg-[#e8f0fe] text-brand",
    },
    {
      label: "Favorite products",
      value: "—",
      icon: Heart,
      tone: "bg-rose-50 text-rose-500",
    },
    {
      label: "Reviews added",
      value: loading ? "—" : String(reviewCount),
      icon: Star,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Returns",
      value: loading ? "—" : String(cancelledCount),
      icon: Undo2,
      tone: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          My account
        </h1>
        <p className="mt-1 text-sm text-muted">
          Overview of your placements, billing details, and active orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-line bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink">{stat.value}</p>
                </div>
                <span className={cn("grid size-10 place-items-center rounded-lg", stat.tone)}>
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-xl border border-line bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-ink">Account data</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-navy text-lg font-bold text-white">
              {initials(displayName)}
            </span>
            <div className="min-w-0 space-y-3">
              <div>
                <p className="text-base font-bold text-ink">{displayName}</p>
                <span className="mt-1 inline-flex rounded-full bg-[#e8f0fe] px-2.5 py-0.5 text-[11px] font-bold text-navy">
                  {user.role === "CUSTOMER" ? "Customer" : user.role}
                </span>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-muted uppercase">
                    Email Address
                  </dt>
                  <dd className="mt-1 font-medium text-ink break-all">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-muted uppercase">
                    Delivery Address
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{address}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-muted uppercase">
                    Phone Number
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{phone}</dd>
                </div>
              </dl>
              <ButtonLink href="/account/settings/billing" size="sm">
                Edit your data
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-[linear-gradient(160deg,#071b3d_0%,#0c2a56_55%,#1268f3_140%)] p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Linkerbuddy PRO</p>
                <p className="mt-1 text-2xl font-extrabold">
                  $9.99
                  <span className="text-sm font-medium text-white/70">/month</span>
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-lg bg-white/10">
                <Rocket className="size-5" />
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>Priority publisher matching</li>
              <li>Faster turnaround options</li>
              <li>Exclusive inventory alerts</li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-5 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-navy opacity-90"
            >
              Upgrade to PRO — Coming soon
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Active orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-brand no-underline hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="px-5 py-10 text-sm text-muted">Loading orders…</p>
        ) : activeOrders.length === 0 ? (
          <p className="px-5 py-10 text-sm text-muted">
            No active orders. Browse the marketplace to get started.
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
                {activeOrders.map((order) => (
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
                      <OrderRowActions order={order} onView={setSelected} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <OrderDetailModal
        order={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onUpdated={(updated) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          setSelected(updated);
        }}
      />
    </div>
  );
}
