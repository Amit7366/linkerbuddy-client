"use client";

import { useEffect, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import type { Order } from "@/types/order";
import {
  canUserCancel,
  formatCents,
  paymentLabel,
  statusBadgeClass,
  statusLabel,
} from "@/lib/orders-ui";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { cancelMyOrder } from "@/lib/api/orders";
import { downloadOrderPdf } from "@/lib/order-pdf";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: (order: Order) => void;
}

export function OrderDetailModal({
  order,
  open,
  onClose,
  onUpdated,
}: OrderDetailModalProps) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !order) return null;

  async function handleCancel() {
    if (!order || !canUserCancel(order.status)) return;
    if (!window.confirm(`Cancel order ${order.orderNumber}?`)) return;
    setCancelling(true);
    setError(null);
    try {
      const updated = await cancelMyOrder(order.id);
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-muted uppercase">
              Order details
            </p>
            <h2 className="mt-1 font-mono text-xl font-extrabold text-ink">
              {order.orderNumber}
            </h2>
            <span
              className={cn(
                "mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                statusBadgeClass(order.status),
              )}
            >
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => downloadOrderPdf(order)}
              className="rounded-lg p-2 text-muted hover:bg-sky hover:text-navy"
              aria-label="Download PDF"
            >
              <Download className="size-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted hover:bg-sky"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold text-ink">Progress</h3>
            <OrderTimeline status={order.status} events={order.statusEvents} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Items</h3>
              <ul className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
                  >
                    <p className="font-semibold text-ink">{item.domain}</p>
                    <p className="text-xs text-muted">
                      {item.serviceType === "GUEST" ? "Guest post" : "Link insert"} ×{" "}
                      {item.quantity} · {formatCents(item.unitPriceCents, order.currency)} each —{" "}
                      {formatCents(item.lineTotalCents, order.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Billing</h3>
              <p className="mt-1 text-sm text-muted">
                {order.billingName}
                <br />
                {order.billingEmail}
                <br />
                {order.billingPhone}
                <br />
                {order.addressLine1}
                {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                <br />
                {order.city}, {order.state} {order.postalCode}
                <br />
                {order.country}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-line bg-surface px-3 py-2">
              {(order.discountCents ?? 0) > 0 || order.subtotalCents !== order.totalCents ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold text-ink">
                      {formatCents(order.subtotalCents, order.currency)}
                    </span>
                  </div>
                  {(order.discountCents ?? 0) > 0 ? (
                    <div className="flex items-center justify-between text-sm text-emerald-700">
                      <span>
                        Discount
                        {order.promoCodeLabel ? ` (${order.promoCodeLabel})` : ""}
                      </span>
                      <span>−{formatCents(order.discountCents ?? 0, order.currency)}</span>
                    </div>
                  ) : null}
                  {order.manualTotalCents != null &&
                  order.manualTotalCents !== order.subtotalCents - (order.discountCents ?? 0) ? (
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span>Adjustment</span>
                      <span>
                        {formatCents(
                          order.totalCents - (order.subtotalCents - (order.discountCents ?? 0)),
                          order.currency,
                        )}
                      </span>
                    </div>
                  ) : null}
                </>
              ) : null}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Payment</p>
                  <p className="text-sm font-semibold text-ink">
                    {paymentLabel(order.paymentStatus)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Total</p>
                  <p className="text-lg font-extrabold text-ink">
                    {formatCents(order.totalCents, order.currency)}
                  </p>
                </div>
              </div>
            </div>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            {canUserCancel(order.status) ? (
              <Button
                variant="ghost"
                className="w-full text-red-600"
                disabled={cancelling}
                onClick={() => void handleCancel()}
              >
                {cancelling ? "Cancelling…" : "Cancel order"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderRowActions({
  order,
  onView,
  showLabels = false,
}: {
  order: Order;
  onView: (order: Order) => void;
  showLabels?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onView(order)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-muted transition hover:bg-sky hover:text-navy",
          showLabels ? "border border-line px-2.5 py-1.5 text-xs font-semibold" : "p-2",
        )}
        aria-label="View order"
      >
        <Eye className="size-4" />
        {showLabels ? "View" : null}
      </button>
      <button
        type="button"
        onClick={() => downloadOrderPdf(order)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg text-muted transition hover:bg-sky hover:text-navy",
          showLabels ? "border border-line px-2.5 py-1.5 text-xs font-semibold" : "p-2",
        )}
        aria-label="Download PDF"
        title="Download PDF invoice"
      >
        <Download className="size-4" />
        {showLabels ? "Download" : null}
      </button>
    </div>
  );
}
