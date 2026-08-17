import type { OrderStatus } from "@/types/order";

export const ORDER_FLOW_STEPS: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERING",
  "COMPLETE",
];

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERING",
];

export function centsToDollarsInput(cents: number) {
  return (cents / 100).toFixed(2);
}

export function dollarsInputToCents(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(amount * 100);
}

export function formatCents(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function formatDollars(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    PROCESSING: "Processing",
    SHIPPING: "Shipping",
    DELIVERING: "Delivering",
    COMPLETE: "Complete",
    FAILED: "Failed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };
  return labels[status];
}

export function paymentLabel(status: string) {
  const labels: Record<string, string> = {
    UNPAID: "Unpaid",
    PAID: "Paid",
    FAILED: "Payment failed",
    REFUNDED: "Refunded",
  };
  return labels[status] ?? status;
}

export function allowedNextStatuses(current: OrderStatus): OrderStatus[] {
  const map: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["ACCEPTED", "REJECTED"],
    ACCEPTED: ["PROCESSING"],
    PROCESSING: ["SHIPPING"],
    SHIPPING: ["DELIVERING"],
    DELIVERING: ["COMPLETE", "FAILED"],
    FAILED: ["PENDING"],
    REJECTED: ["PENDING"],
    CANCELLED: ["PENDING"],
    COMPLETE: [],
  };
  return map[current];
}

export function canUserCancel(status: OrderStatus) {
  return status === "PENDING" || status === "ACCEPTED";
}

export function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case "COMPLETE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
    case "CANCELLED":
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "SHIPPING":
    case "DELIVERING":
      return "bg-sky-50 text-sky-800 border-sky-200";
    default:
      return "bg-[#e8f0fe] text-navy border-[#c5d8f8]";
  }
}
