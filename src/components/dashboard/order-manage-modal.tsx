"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import type { Order, OrderItem, ServiceType } from "@/types/order";
import {
  allowedNextStatuses,
  centsToDollarsInput,
  dollarsInputToCents,
  formatCents,
  paymentLabel,
  statusLabel,
} from "@/lib/orders-ui";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { listPromos, type PromoCode } from "@/lib/api/promos";
import { listMarketplace } from "@/lib/api/marketplace";
import type { SiteListing } from "@/config/landing";
import { cn } from "@/lib/utils";

type DraftItem = {
  key: string;
  id?: string;
  listingId: number;
  domain: string;
  niche: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: string;
  catalogGuest?: number;
  catalogInsert?: number;
};

type BillingDraft = {
  billingName: string;
  billingPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
};

function itemToDraft(item: OrderItem): DraftItem {
  return {
    key: item.id,
    id: item.id,
    listingId: item.listingId,
    domain: item.domain,
    niche: item.niche,
    serviceType: item.serviceType,
    quantity: item.quantity,
    unitPrice: centsToDollarsInput(item.unitPriceCents),
  };
}

function lineTotalCents(item: DraftItem) {
  return dollarsInputToCents(item.unitPrice) * Math.max(1, item.quantity);
}

interface OrderManageModalProps {
  order: Order;
  saving: boolean;
  onClose: () => void;
  onStatus: (status: Order["status"]) => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}

export function OrderManageModal({
  order,
  saving,
  onClose,
  onStatus,
  onSave,
}: OrderManageModalProps) {
  const locked =
    order.status === "COMPLETE" ||
    order.status === "REJECTED" ||
    order.status === "CANCELLED";
  const nextStatuses = allowedNextStatuses(order.status);

  const [billing, setBilling] = useState<BillingDraft>({
    billingName: order.billingName,
    billingPhone: order.billingPhone,
    addressLine1: order.addressLine1,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    country: order.country,
    notes: order.notes ?? "",
  });
  const [items, setItems] = useState<DraftItem[]>(order.items.map(itemToDraft));
  const [promoInput, setPromoInput] = useState(order.promoCodeLabel ?? "");
  const [appliedPromo, setAppliedPromo] = useState(order.promoCodeLabel ?? "");
  const [manualTotal, setManualTotal] = useState(
    order.manualTotalCents != null ? centsToDollarsInput(order.manualTotalCents) : "",
  );
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [listingQuery, setListingQuery] = useState("");
  const [listingResults, setListingResults] = useState<SiteListing[]>([]);
  const [listingOpen, setListingOpen] = useState(false);
  const [swapKey, setSwapKey] = useState<string | null>(null);

  useEffect(() => {
    setBilling({
      billingName: order.billingName,
      billingPhone: order.billingPhone,
      addressLine1: order.addressLine1,
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
      country: order.country,
      notes: order.notes ?? "",
    });
    setItems(order.items.map(itemToDraft));
    setPromoInput(order.promoCodeLabel ?? "");
    setAppliedPromo(order.promoCodeLabel ?? "");
    setManualTotal(
      order.manualTotalCents != null ? centsToDollarsInput(order.manualTotalCents) : "",
    );
  }, [order]);

  useEffect(() => {
    void listPromos({ active: "true", limit: 50 })
      .then((data) => setPromos(data.promos.filter((promo) => promo.active)))
      .catch(() => setPromos([]));
  }, []);

  useEffect(() => {
    if (!listingOpen) return;
    const handle = window.setTimeout(() => {
      void listMarketplace({ q: listingQuery.trim() || undefined, limit: 8 })
        .then((data) => setListingResults(data.listings))
        .catch(() => setListingResults([]));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [listingQuery, listingOpen]);

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + lineTotalCents(item), 0),
    [items],
  );

  function updateItem(key: string, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function pickListing(listing: SiteListing) {
    if (swapKey) {
      setItems((prev) =>
        prev.map((item) =>
          item.key === swapKey
            ? {
                ...item,
                listingId: listing.id,
                domain: listing.domain,
                niche: listing.niche,
                catalogGuest: listing.guest,
                catalogInsert: listing.insert,
                unitPrice: centsToDollarsInput(
                  Math.round(
                    (item.serviceType === "INSERT" ? listing.insert : listing.guest) * 100,
                  ),
                ),
              }
            : item,
        ),
      );
      setSwapKey(null);
    } else {
      setItems((prev) => [
        ...prev,
        {
          key: `new-${listing.id}-${Date.now()}`,
          listingId: listing.id,
          domain: listing.domain,
          niche: listing.niche,
          serviceType: "GUEST",
          quantity: 1,
          catalogGuest: listing.guest,
          catalogInsert: listing.insert,
          unitPrice: centsToDollarsInput(Math.round((listing.guest ?? 0) * 100)),
        },
      ]);
    }
    setListingOpen(false);
    setListingQuery("");
  }

  async function save(extra?: { promoCode?: string | null; manualTotalCents?: number | null }) {
    if (items.length === 0) return false;
    try {
      await onSave({
        ...billing,
        notes: billing.notes || null,
        items: items.map((item) => ({
          id: item.id,
          listingId: item.listingId,
          domain: item.domain,
          niche: item.niche,
          serviceType: item.serviceType,
          quantity: item.quantity,
          unitPriceCents: dollarsInputToCents(item.unitPrice),
        })),
        promoCode:
          extra && "promoCode" in extra
            ? extra.promoCode
            : appliedPromo || null,
        manualTotalCents:
          extra && "manualTotalCents" in extra
            ? extra.manualTotalCents
            : manualTotal.trim()
              ? dollarsInputToCents(manualTotal)
              : null,
      });
      return true;
    } catch {
      /* Parent surfaces the API error. */
      return false;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Manage order
            </p>
            <h2 className="mt-1 font-mono text-xl font-bold text-zinc-900">
              {order.orderNumber}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {paymentLabel(order.paymentStatus)} · {order.billingEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <section>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-900">Items</h3>
                {!locked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSwapKey(null);
                      setListingOpen((open) => !open);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    <Plus className="size-3.5" />
                    Add product
                  </button>
                ) : null}
              </div>

              {listingOpen && !locked ? (
                <div className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={listingQuery}
                      onChange={(e) => setListingQuery(e.target.value)}
                      placeholder={swapKey ? "Swap for a listing…" : "Search listings to add…"}
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white pr-3 pl-8 text-sm"
                    />
                  </div>
                  <ul className="mt-2 max-h-40 overflow-y-auto">
                    {listingResults.map((listing) => (
                      <li key={listing.id}>
                        <button
                          type="button"
                          onClick={() => pickListing(listing)}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white"
                        >
                          <span>
                            <span className="font-semibold">{listing.domain}</span>
                            <span className="ml-2 text-xs text-zinc-500">{listing.niche}</span>
                          </span>
                          <span className="text-xs text-zinc-500">
                            GP ${listing.guest} · LI ${listing.insert}
                          </span>
                        </button>
                      </li>
                    ))}
                    {listingResults.length === 0 ? (
                      <li className="px-2 py-2 text-xs text-zinc-500">No listings found.</li>
                    ) : null}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.key} className="rounded-xl border border-zinc-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-zinc-900">{item.domain}</p>
                        <p className="text-[11px] text-zinc-500">{item.niche}</p>
                      </div>
                      {!locked ? (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-[11px] font-semibold text-brand hover:bg-sky"
                            onClick={() => {
                              setSwapKey(item.key);
                              setListingOpen(true);
                            }}
                          >
                            Swap
                          </button>
                          <button
                            type="button"
                            className="rounded-md p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              setItems((prev) => prev.filter((row) => row.key !== item.key))
                            }
                            aria-label={`Remove ${item.domain}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <label className="text-[11px] text-zinc-500">
                        Service
                        <select
                          disabled={locked || saving}
                          className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
                          value={item.serviceType}
                          onChange={(e) => {
                            const serviceType = e.target.value as ServiceType;
                            const nextPrice =
                              serviceType === "INSERT"
                                ? item.catalogInsert
                                : item.catalogGuest;
                            updateItem(item.key, {
                              serviceType,
                              ...(nextPrice != null
                                ? { unitPrice: centsToDollarsInput(Math.round(nextPrice * 100)) }
                                : {}),
                            });
                          }}
                        >
                          <option value="GUEST">Guest post</option>
                          <option value="INSERT">Link insert</option>
                        </select>
                      </label>
                      <label className="text-[11px] text-zinc-500">
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={99}
                          disabled={locked || saving}
                          className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.key, {
                              quantity: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                        />
                      </label>
                      <label className="text-[11px] text-zinc-500">
                        Unit price ($)
                        <input
                          disabled={locked || saving}
                          className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.key, { unitPrice: e.target.value })}
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-right text-xs font-semibold text-zinc-700">
                      Line {formatCents(lineTotalCents(item))}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 p-3">
              <h3 className="text-sm font-bold text-zinc-900">Promo & total</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  disabled={locked || saving}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="h-9 min-w-[140px] flex-1 rounded-lg border border-zinc-200 px-2 text-sm uppercase"
                />
                <select
                  disabled={locked || saving}
                  className="h-9 rounded-lg border border-zinc-200 px-2 text-sm"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setPromoInput(e.target.value);
                  }}
                >
                  <option value="">Saved codes</option>
                  {promos.map((promo) => (
                    <option key={promo.id} value={promo.code}>
                      {promo.code} · {promo.type === "PERCENT" ? `${promo.value}%` : formatCents(promo.value)}
                    </option>
                  ))}
                </select>
                {!locked ? (
                  <>
                    <button
                      type="button"
                      disabled={saving || !promoInput.trim()}
                      onClick={() => {
                        void (async () => {
                          const code = promoInput.trim().toUpperCase();
                          const ok = await save({ promoCode: code });
                          if (ok) setAppliedPromo(code);
                        })();
                      }}
                      className="h-9 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Apply
                    </button>
                    {appliedPromo ? (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          void (async () => {
                            const ok = await save({ promoCode: null });
                            if (ok) {
                              setPromoInput("");
                              setAppliedPromo("");
                            }
                          })();
                        }}
                        className="h-9 rounded-lg border border-zinc-200 px-3 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    ) : null}
                  </>
                ) : null}
              </div>
              {order.promoCodeLabel ? (
                <p className="mt-2 text-xs text-emerald-700">
                  Applied {order.promoCodeLabel} (−{formatCents(order.discountCents ?? 0)})
                </p>
              ) : null}

              <label className="mt-3 block text-[11px] text-zinc-500">
                Manual total override ($)
                <input
                  disabled={locked || saving}
                  value={manualTotal}
                  onChange={(e) => setManualTotal(e.target.value)}
                  placeholder="Leave blank to use promo total"
                  className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
                />
              </label>

              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <dt>Subtotal</dt>
                  <dd>{formatCents(subtotalCents)}</dd>
                </div>
                {(order.discountCents ?? 0) > 0 ? (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount {order.promoCodeLabel ? `(${order.promoCodeLabel})` : ""}</dt>
                    <dd>−{formatCents(order.discountCents ?? 0)}</dd>
                  </div>
                ) : null}
                {order.manualTotalCents != null ? (
                  <div className="flex justify-between text-zinc-600">
                    <dt>Manual total</dt>
                    <dd>{formatCents(order.manualTotalCents)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-zinc-900">
                  <dt>Total due</dt>
                  <dd>{formatCents(order.totalCents, order.currency)}</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Status timeline</h3>
              <OrderTimeline status={order.status} events={order.statusEvents} />
              {nextStatuses.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {nextStatuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving}
                      onClick={() => onStatus(s)}
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
                <p className="mt-3 text-xs text-zinc-500">No further status changes available.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-900">Edit billing</h3>
              {locked ? (
                <p className="mt-2 text-xs text-amber-700">
                  {order.status === "COMPLETE"
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
                      value={billing[key]}
                      onChange={(e) =>
                        setBilling((prev) => ({ ...prev, [key]: e.target.value }))
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
                    value={billing.notes}
                    onChange={(e) =>
                      setBilling((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {!locked ? (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={saving || items.length === 0}
              onClick={() => void save()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save order changes"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
