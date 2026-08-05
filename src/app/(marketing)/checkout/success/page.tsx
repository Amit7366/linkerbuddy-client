"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import { withLocalePrefix } from "@/i18n/routing";

function SuccessContent() {
  const t = useTranslations();
  const { locale } = useLocale();
  const params = useSearchParams();
  const orderNumber = params.get("order") ?? "";
  const homeHref = withLocalePrefix("/", locale);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="size-9" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink">
        {t("checkout.successTitle")}
      </h1>
      <p className="mt-3 text-muted">{t("checkout.successSubtitle")}</p>
      {orderNumber ? (
        <div className="mt-8 w-full rounded-2xl border border-line bg-surface px-5 py-4">
          <p className="text-[11px] font-bold tracking-wide text-muted uppercase">
            {t("checkout.orderNumber")}
          </p>
          <p className="mt-1 font-mono text-xl font-extrabold text-ink">{orderNumber}</p>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={homeHref}>{t("checkout.backHome")}</ButtonLink>
        <Link
          href="/account/orders"
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-navy underline-offset-2 hover:underline"
        >
          {t("checkout.viewOrders")}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
