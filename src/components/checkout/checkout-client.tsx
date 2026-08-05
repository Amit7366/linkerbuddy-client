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
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useCart } from "@/providers/shortlist-provider";
import { useTranslations, useLocale } from "@/providers/locale-provider";
import { useSession } from "@/providers/session-provider";
import { getBillingProfile } from "@/lib/api/users";
import { createCheckoutIntent, confirmMyOrderPayment } from "@/lib/api/orders";
import type { AuthUser } from "@/types/auth";
import { Button, ButtonLink } from "@/components/ui/button";
import { withLocalePrefix } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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

type CheckoutStep = "details" | "payment";

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

function Field({
  id,
  label,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1.5 text-[13px] font-semibold text-ink">
        <span>{label}</span>
        {optional ? <span className="font-medium text-muted">({optional === true ? "optional" : optional})</span> : null}
      </label>
      {children}
    </div>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-line bg-card px-3.5 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70";

function StatusCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full rounded-3xl border border-line bg-card p-8 shadow-[var(--shadow-table)]">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-sky text-brand">
          <Package className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-7 flex justify-center">{action}</div>
      </div>
    </div>
  );
}

function CheckoutSteps({ step }: { step: CheckoutStep }) {
  const steps = [
    { id: "details" as const, label: "Details", icon: UserRound },
    { id: "payment" as const, label: "Payment", icon: CreditCard },
  ];
  const activeIndex = steps.findIndex((s) => s.id === step);

  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Checkout progress">
      {steps.map((item, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        const Icon = item.icon;
        return (
          <li key={item.id} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border px-3 py-2.5 sm:px-4",
                active && "border-brand/30 bg-sky",
                done && "border-green/25 bg-emerald-50/80 dark:bg-emerald-950/30",
                !active && !done && "border-line bg-card",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                  active && "bg-brand text-white shadow-[var(--shadow-btn)]",
                  done && "bg-green text-white",
                  !active && !done && "bg-surface text-muted",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={2.5} /> : <Icon className="size-3.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider text-muted uppercase">
                  Step {index + 1}
                </p>
                <p className={cn("truncate text-sm font-semibold", active || done ? "text-ink" : "text-muted")}>
                  {item.label}
                </p>
              </div>
            </div>
            {index < steps.length - 1 ? (
              <span className="hidden h-px w-4 shrink-0 bg-line sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function PaymentForm({
  orderId,
  orderNumber,
  successPath,
  amount,
  onSuccess,
}: {
  orderId: string;
  orderNumber: string;
  successPath: string;
  amount: number;
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
          return_url: `${window.location.origin}${successPath}?order=${encodeURIComponent(orderNumber)}`,
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
    <form onSubmit={(e) => void handlePay(e)} className="space-y-5">
      <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full text-base" disabled={!stripe || submitting}>
        <Lock className="mr-2 size-4 opacity-90" />
        {submitting ? t("checkout.processing") : `${t("checkout.pay")} · $${amount}`}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <ShieldCheck className="size-3.5 text-green" />
        Encrypted card payment powered by Stripe
      </p>
    </form>
  );
}

export function CheckoutClient() {
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();
  const { items, total, clear, getListing, getUnitPrice, getLineTotal } = useCart();
  const { user, loading: authLoading } = useSession();
  const [billing, setBilling] = useState<BillingForm>(emptyBilling());
  const [billingReady, setBillingReady] = useState(false);
  const [saveProfile, setSaveProfile] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderMeta, setOrderMeta] = useState<{ id: string; number: string } | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const checkoutPath = withLocalePrefix("/checkout", locale);
  const checkoutSuccessPath = withLocalePrefix("/checkout/success", locale);
  const homePath = withLocalePrefix("/", locale);
  const loginHref = `/login?redirect=${encodeURIComponent(checkoutPath)}`;
  const step: CheckoutStep = clientSecret ? "payment" : "details";

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setBillingReady(true);
      return;
    }

    let cancelled = false;
    setBillingReady(false);
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
      `${checkoutSuccessPath}?order=${encodeURIComponent(orderMeta?.number ?? "")}`,
    );
  }

  if (authLoading || !billingReady) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-muted">
          <div className="size-9 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm">Preparing checkout…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <StatusCard
        title={t("checkout.title")}
        description={t("checkout.loginRequired")}
        action={
          <ButtonLink href={loginHref} className="inline-flex min-w-[160px] justify-center">
            {t("checkout.signIn")}
          </ButtonLink>
        }
      />
    );
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <StatusCard
        title={t("checkout.title")}
        description={t("checkout.empty")}
        action={
          <ButtonLink href={`${homePath}#marketplace`} className="inline-flex min-w-[180px] justify-center">
            {t("checkout.browse")}
          </ButtonLink>
        }
      />
    );
  }

  if (!stripePromise || !publishableKey) {
    return (
      <StatusCard
        title={t("checkout.title")}
        description="Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
        action={
          <ButtonLink href={homePath} className="inline-flex">
            {t("checkout.backHome")}
          </ButtonLink>
        }
      />
    );
  }

  const summary = (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-ink">{t("checkout.orderSummary")}</h2>
        <span className="rounded-full bg-sky px-2.5 py-1 text-[11px] font-bold text-brand">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const listing = getListing(item.listingId);
          return (
            <li
              key={item.listingId}
              className="flex gap-3 rounded-2xl border border-line bg-card p-3.5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-[11px] font-bold tracking-wide text-white">
                {(listing?.domain ?? "LB").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">
                  {listing?.domain ?? `#${item.listingId}`}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.serviceType === "guest" ? "Guest post" : "Link insert"}
                  {" · "}
                  Qty {item.quantity}
                  {" · "}
                  ${getUnitPrice(item.listingId)} each
                </p>
              </div>
              <p className="shrink-0 text-sm font-extrabold text-ink">
                ${getLineTotal(item.listingId)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2.5 rounded-2xl border border-line bg-surface/80 px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-ink">${total}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Fees</span>
          <span className="font-semibold text-green">Included</span>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm font-bold text-ink">Total due</span>
          <span className="text-2xl font-extrabold tracking-tight text-ink">${total}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs leading-relaxed text-muted">
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-green" />
          Secure checkout with bank-grade encryption.
        </p>
        <p className="flex items-start gap-2">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-brand" />
          Card details never touch Linkerbuddy servers.
        </p>
        <p>
          Update saved details in{" "}
          <Link href="/account/settings/billing" className="font-semibold text-navy underline-offset-2 hover:underline">
            billing profile
          </Link>
          .
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,var(--sky)_0%,var(--page)_28%,var(--page)_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,rgba(18,104,243,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`${homePath}#marketplace`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted no-underline transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Continue browsing
          </Link>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[11px] font-semibold text-muted">
            <Lock className="size-3 text-brand" />
            Secure checkout
          </p>
        </div>

        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("checkout.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="mb-8 max-w-xl">
          <CheckoutSteps step={step} />
        </div>

        {/* Mobile order summary accordion */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-card px-4 py-3.5 text-left shadow-[var(--shadow-table)]"
          >
            <span className="text-sm font-bold text-ink">
              {summaryOpen ? "Hide" : "Show"} order summary
            </span>
            <span className="text-lg font-extrabold text-ink">${total}</span>
          </button>
          {summaryOpen ? (
            <div className="mt-3 rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-table)]">
              {summary}
            </div>
          ) : null}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-8">
          <motion.section
            key={step}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-line bg-card p-5 shadow-[var(--shadow-table)] sm:p-7"
          >
            {step === "details" ? (
              <>
                <div className="flex items-start gap-3 border-b border-line pb-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-sky text-brand">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-ink">{t("checkout.billing")}</h2>
                    <p className="mt-0.5 text-sm text-muted">
                      Used for invoices and order confirmation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-7">
                  <section>
                    <h3 className="mb-3 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                      Contact
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="billingName" label="Full name">
                        <input
                          id="billingName"
                          className={fieldClass}
                          autoComplete="name"
                          value={billing.billingName}
                          onChange={(e) => setField("billingName", e.target.value)}
                        />
                      </Field>
                      <Field id="billingEmail" label="Email">
                        <input
                          id="billingEmail"
                          type="email"
                          className={fieldClass}
                          autoComplete="email"
                          value={billing.billingEmail}
                          disabled
                          onChange={(e) => setField("billingEmail", e.target.value)}
                        />
                      </Field>
                      <Field id="billingPhone" label="Phone">
                        <input
                          id="billingPhone"
                          type="tel"
                          className={fieldClass}
                          autoComplete="tel"
                          value={billing.billingPhone}
                          onChange={(e) => setField("billingPhone", e.target.value)}
                        />
                      </Field>
                      <Field id="billingCompany" label="Company" optional>
                        <input
                          id="billingCompany"
                          className={fieldClass}
                          autoComplete="organization"
                          value={billing.billingCompany}
                          onChange={(e) => setField("billingCompany", e.target.value)}
                        />
                      </Field>
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                      Billing address
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="addressLine1" label="Address line 1" className="sm:col-span-2">
                        <input
                          id="addressLine1"
                          className={fieldClass}
                          autoComplete="address-line1"
                          value={billing.addressLine1}
                          onChange={(e) => setField("addressLine1", e.target.value)}
                        />
                      </Field>
                      <Field id="addressLine2" label="Address line 2" optional className="sm:col-span-2">
                        <input
                          id="addressLine2"
                          className={fieldClass}
                          autoComplete="address-line2"
                          value={billing.addressLine2}
                          onChange={(e) => setField("addressLine2", e.target.value)}
                        />
                      </Field>
                      <Field id="city" label="City">
                        <input
                          id="city"
                          className={fieldClass}
                          autoComplete="address-level2"
                          value={billing.city}
                          onChange={(e) => setField("city", e.target.value)}
                        />
                      </Field>
                      <Field id="state" label="State / Province">
                        <input
                          id="state"
                          className={fieldClass}
                          autoComplete="address-level1"
                          value={billing.state}
                          onChange={(e) => setField("state", e.target.value)}
                        />
                      </Field>
                      <Field id="postalCode" label="Postal code">
                        <input
                          id="postalCode"
                          className={fieldClass}
                          autoComplete="postal-code"
                          value={billing.postalCode}
                          onChange={(e) => setField("postalCode", e.target.value)}
                        />
                      </Field>
                      <Field id="country" label="Country">
                        <input
                          id="country"
                          className={fieldClass}
                          autoComplete="country-name"
                          value={billing.country}
                          onChange={(e) => setField("country", e.target.value)}
                        />
                      </Field>
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                      Notes
                    </h3>
                    <Field id="notes" label="Order notes" optional>
                      <textarea
                        id="notes"
                        rows={3}
                        className={cn(fieldClass, "h-auto min-h-[88px] resize-y py-3")}
                        placeholder="Campaign goals, anchor preferences, deadlines…"
                        value={billing.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                      />
                    </Field>
                  </section>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3.5">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-line text-brand focus:ring-brand"
                    checked={saveProfile}
                    onChange={(e) => setSaveProfile(e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {t("checkout.saveProfile")}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      Autofill faster on your next order.
                    </span>
                  </span>
                </label>

                {error ? (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted">
                    {!canCreateIntent
                      ? "Complete required fields to continue."
                      : "Next: secure payment with Stripe."}
                  </p>
                  <Button
                    className="h-12 min-w-[200px] justify-center"
                    disabled={!canCreateIntent || intentLoading}
                    onClick={() => void startPayment()}
                  >
                    {intentLoading ? (
                      t("checkout.processing")
                    ) : (
                      <>
                        Continue to payment
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 border-b border-line pb-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-sky text-brand">
                    <CreditCard className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-ink">Payment</h2>
                    <p className="mt-0.5 text-sm text-muted">
                      Order {orderMeta?.number ? `#${orderMeta.number}` : "ready"} · ${total}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-sm font-semibold text-brand hover:underline"
                    onClick={() => {
                      setClientSecret(null);
                      setOrderMeta(null);
                      setError(null);
                    }}
                  >
                    Edit details
                  </button>
                </div>

                <div className="mt-6">
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: clientSecret ?? undefined,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#1268f3",
                          colorBackground: "#ffffff",
                          colorText: "#0b1830",
                          colorDanger: "#dc2626",
                          borderRadius: "12px",
                          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                        },
                      },
                    }}
                  >
                    <PaymentForm
                      orderId={orderMeta!.id}
                      orderNumber={orderMeta!.number}
                      successPath={checkoutSuccessPath}
                      amount={total}
                      onSuccess={handleSuccess}
                    />
                  </Elements>
                </div>
              </>
            )}
          </motion.section>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-table)]">
              {summary}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
