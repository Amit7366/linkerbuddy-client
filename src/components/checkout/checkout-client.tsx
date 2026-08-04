"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart } from "@/providers/shortlist-provider";
import { useTranslations } from "@/providers/locale-provider";
import { useSession } from "@/providers/session-provider";
import { getBillingProfile } from "@/lib/api/users";
import { createCheckoutIntent, confirmMyOrderPayment } from "@/lib/api/orders";
import type { AuthUser } from "@/types/auth";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type BillingForm = {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingCompany: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
};

function emptyBilling(): BillingForm {
  return {
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingCompany: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: "",
  };
}

function fromUser(user: AuthUser): BillingForm {
  return {
    billingName: user.name ?? "",
    billingEmail: user.email,
    billingPhone: user.phone ?? "",
    billingCompany: user.company ?? "",
    addressLine1: user.addressLine1 ?? "",
    addressLine2: user.addressLine2 ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    postalCode: user.postalCode ?? "",
    country: user.country ?? "",
    notes: "",
  };
}

function billingValid(b: BillingForm) {
  return Boolean(
    b.billingName.trim() &&
      b.billingEmail.trim() &&
      b.billingPhone.trim() &&
      b.addressLine1.trim() &&
      b.city.trim() &&
      b.state.trim() &&
      b.postalCode.trim() &&
      b.country.trim(),
  );
}

function PaymentForm({
  orderId,
  orderNumber,
  onSuccess,
}: {
  orderId: string;
  orderNumber: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order=${encodeURIComponent(orderNumber)}`,
        },
      });
      if (result.error) {
        setError(result.error.message ?? "Payment failed");
        return;
      }
      await confirmMyOrderPayment(orderId).catch(() => null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => void handlePay(e)} className="space-y-4">
      <PaymentElement />
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? t("checkout.processing") : t("checkout.pay")}
      </Button>
    </form>
  );
}

export function CheckoutClient() {
  const t = useTranslations();
  const router = useRouter();
  const { items, total, clear, getListing, getUnitPrice, getLineTotal } = useCart();
  const { user, loading: authLoading } = useSession();
  const [billing, setBilling] = useState<BillingForm>(emptyBilling());
  const [billingReady, setBillingReady] = useState(false);
  const [saveProfile, setSaveProfile] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderMeta, setOrderMeta] = useState<{ id: string; number: string } | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setBillingReady(true);
      return;
    }

    let cancelled = false;
    void getBillingProfile()
      .then((profile) => {
        if (cancelled) return;
        setBilling(fromUser(profile as AuthUser));
      })
      .catch(() => {
        if (!cancelled) setBilling(fromUser(user));
      })
      .finally(() => {
        if (!cancelled) setBillingReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const setField = useCallback(<K extends keyof BillingForm>(key: K, value: BillingForm[K]) => {
    setBilling((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canCreateIntent = useMemo(
    () => items.length > 0 && billingValid(billing) && Boolean(user),
    [items.length, billing, user],
  );

  async function startPayment() {
    if (!canCreateIntent) return;
    setIntentLoading(true);
    setError(null);
    try {
      const data = await createCheckoutIntent({
        items: items.map((item) => ({
          listingId: item.listingId,
          serviceType: item.serviceType === "guest" ? "GUEST" : "INSERT",
          quantity: item.quantity,
        })),
        billing: {
          billingName: billing.billingName.trim(),
          billingEmail: billing.billingEmail.trim(),
          billingPhone: billing.billingPhone.trim(),
          billingCompany: billing.billingCompany.trim() || null,
          addressLine1: billing.addressLine1.trim(),
          addressLine2: billing.addressLine2.trim() || null,
          city: billing.city.trim(),
          state: billing.state.trim(),
          postalCode: billing.postalCode.trim(),
          country: billing.country.trim(),
          notes: billing.notes.trim() || null,
        },
        saveBillingToProfile: saveProfile,
      });
      setClientSecret(data.clientSecret);
      setOrderMeta({ id: data.orderId, number: data.orderNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
    } finally {
      setIntentLoading(false);
    }
  }

  function handleSuccess() {
    clear();
    router.push(
      `/checkout/success?order=${encodeURIComponent(orderMeta?.number ?? "")}`,
    );
  }

  if (authLoading || !billingReady) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">{t("checkout.title")}</h1>
        <p className="mt-3 text-muted">{t("checkout.loginRequired")}</p>
        <ButtonLink href="/login?redirect=/checkout" className="mt-6 inline-flex">
          {t("checkout.signIn")}
        </ButtonLink>
      </div>
    );
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">{t("checkout.title")}</h1>
        <p className="mt-3 text-muted">{t("checkout.empty")}</p>
        <ButtonLink href="/#marketplace" className="mt-6 inline-flex">
          {t("checkout.browse")}
        </ButtonLink>
      </div>
    );
  }

  if (!stripePromise || !publishableKey) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">{t("checkout.title")}</h1>
        <p className="mt-3 text-sm text-red-600">
          Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">{t("checkout.title")}</h1>
        <p className="mt-2 text-muted">{t("checkout.subtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">{t("checkout.billing")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["billingName", "Full name"],
                ["billingEmail", "Email"],
                ["billingPhone", "Phone"],
                ["billingCompany", "Company"],
                ["addressLine1", "Address line 1"],
                ["addressLine2", "Address line 2"],
                ["city", "City"],
                ["state", "State / Province"],
                ["postalCode", "Postal code"],
                ["country", "Country"],
              ] as const
            ).map(([key, label]) => (
              <div
                key={key}
                className={
                  key === "addressLine1" || key === "addressLine2" || key === "billingEmail"
                    ? "sm:col-span-2"
                    : undefined
                }
              >
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  className="mt-1.5"
                  value={billing[key]}
                  disabled={Boolean(clientSecret) || (key === "billingEmail")}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none ring-navy/30 focus:ring-2"
                rows={3}
                value={billing.notes}
                disabled={Boolean(clientSecret)}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>
          </div>

          {!clientSecret ? (
            <label className="mt-4 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={saveProfile}
                onChange={(e) => setSaveProfile(e.target.checked)}
              />
              {t("checkout.saveProfile")}
            </label>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!clientSecret ? (
            <Button
              className="mt-6 w-full sm:w-auto"
              disabled={!canCreateIntent || intentLoading}
              onClick={() => void startPayment()}
            >
              {intentLoading ? t("checkout.processing") : "Continue to payment"}
            </Button>
          ) : (
            <div className="mt-6">
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "stripe" },
                }}
              >
                <PaymentForm
                  orderId={orderMeta!.id}
                  orderNumber={orderMeta!.number}
                  onSuccess={handleSuccess}
                />
              </Elements>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-line bg-surface/80 p-6">
          <h2 className="text-lg font-bold text-ink">{t("checkout.orderSummary")}</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const listing = getListing(item.listingId);
              return (
                <li key={item.listingId} className="flex justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {listing?.domain ?? `#${item.listingId}`}
                    </p>
                    <p className="text-xs text-muted">
                      {item.serviceType === "guest" ? "Guest post" : "Link insert"} ×{" "}
                      {item.quantity} · ${getUnitPrice(item.listingId)}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-ink">${getLineTotal(item.listingId)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-muted">Total</span>
            <span className="text-2xl font-extrabold text-ink">${total}</span>
          </div>
          <p className="mt-4 text-xs text-muted">
            Need to update your saved details?{" "}
            <Link href="/account/settings/billing" className="font-semibold text-navy underline">
              Billing profile
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
