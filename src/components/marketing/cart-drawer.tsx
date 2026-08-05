"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/providers/shortlist-provider";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { SiteDetailModal } from "@/components/marketing/site-detail-modal";
import type { SiteListing } from "@/config/landing";
import { withLocalePrefix } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const t = useTranslations();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const titleId = useId();
  const checkoutHref = withLocalePrefix("/checkout", locale);
  const {
    items,
    total,
    count,
    drawerOpen,
    closeDrawer,
    clear,
    remove,
    setServiceType,
    setQuantity,
    getUnitPrice,
    getLineTotal,
    getListing,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [detailSite, setDetailSite] = useState<SiteListing | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              aria-label={t("cart.close")}
              className="absolute inset-0 border-0 bg-[#071b3d]/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            <motion.aside
              className="relative z-10 flex h-full w-full max-w-[420px] flex-col bg-card shadow-[-20px_0_60px_rgba(7,27,61,0.18)]"
              initial={reduce ? { x: 0 } : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.32, ease }}
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <h2 id={titleId} className="text-lg font-bold text-ink">
                    {t("cart.title")}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    {t("cart.itemCount", { count })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-ink"
                  aria-label={t("cart.close")}
                >
                  <X className="size-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="py-16 text-center text-sm text-muted">
                    {t("cart.empty")}
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item) => {
                      const listing = getListing(item.listingId);
                      const domain = listing?.domain ?? `#${item.listingId}`;
                      const unit = getUnitPrice(item.listingId);
                      const line = getLineTotal(item.listingId);
                      return (
                        <li
                          key={item.listingId}
                          className="rounded-xl border border-line bg-surface/60 p-3.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              className="min-w-0 text-left"
                              onClick={() => {
                                if (listing) setDetailSite(listing);
                              }}
                            >
                              <p className="truncate text-[15px] font-bold text-ink underline-offset-2 hover:underline">
                                {domain}
                              </p>
                              {listing ? (
                                <p className="mt-0.5 text-[11px] text-muted">
                                  {listing.niche} · DA {listing.da} · DR {listing.dr}
                                </p>
                              ) : null}
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(item.listingId)}
                              className="rounded-md p-1.5 text-muted hover:bg-white hover:text-red-600"
                              aria-label={t("cart.remove")}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <div className="inline-flex rounded-lg border border-line bg-card p-0.5 text-[11px] font-semibold">
                              <button
                                type="button"
                                onClick={() => setServiceType(item.listingId, "guest")}
                                className={cn(
                                  "rounded-md px-2.5 py-1.5 transition",
                                  item.serviceType === "guest"
                                    ? "bg-navy text-white"
                                    : "text-muted hover:text-ink",
                                )}
                              >
                                {t("cart.guest")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setServiceType(item.listingId, "insert")}
                                className={cn(
                                  "rounded-md px-2.5 py-1.5 transition",
                                  item.serviceType === "insert"
                                    ? "bg-navy text-white"
                                    : "text-muted hover:text-ink",
                                )}
                              >
                                {t("cart.insert")}
                              </button>
                            </div>

                            <div className="inline-flex items-center rounded-lg border border-line bg-card">
                              <button
                                type="button"
                                className="p-1.5 text-muted hover:text-ink"
                                onClick={() =>
                                  setQuantity(item.listingId, item.quantity - 1)
                                }
                                aria-label={t("cart.decreaseQty")}
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="min-w-7 text-center text-sm font-bold text-ink">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="p-1.5 text-muted hover:text-ink"
                                onClick={() =>
                                  setQuantity(item.listingId, item.quantity + 1)
                                }
                                aria-label={t("cart.increaseQty")}
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>

                            <div className="ml-auto text-right">
                              <p className="text-[11px] text-muted">
                                ${unit}/{t("cart.each")}
                              </p>
                              <p className="text-sm font-extrabold text-ink">${line}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <footer className="border-t border-line px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">{t("cart.subtotal")}</span>
                  <span className="text-xl font-extrabold text-ink">${total}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    disabled={items.length === 0}
                    onClick={clear}
                  >
                    {t("cart.clear")}
                  </Button>
                  {items.length === 0 ? (
                    <Button className="flex-[1.4]" disabled>
                      {t("cart.checkout")}
                    </Button>
                  ) : (
                    <ButtonLink
                      href={checkoutHref}
                      className="flex-[1.4] text-center"
                      onClick={closeDrawer}
                    >
                      {t("cart.checkout")}
                    </ButtonLink>
                  )}
                </div>
              </footer>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SiteDetailModal
        site={detailSite}
        open={Boolean(detailSite)}
        onClose={() => setDetailSite(null)}
      />
    </>,
    document.body,
  );
}
