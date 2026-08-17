"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/shortlist-provider";
import { cn } from "@/lib/utils";

export function CartFloatButton() {
  const { presentation, count, openDrawer } = useCart();

  if (presentation !== "float" || count === 0) return null;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open cart, ${count} items`}
      className={cn(
        "fixed top-1/2 right-4 z-[60] flex size-14 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-navy text-white shadow-[0_12px_40px_color-mix(in_srgb,var(--navy)_35%,transparent)]",
        "ring-2 ring-white/20 transition hover:scale-105 hover:bg-navy-hover",
        "tablet:right-6",
        "animate-[cart-pulse_2s_ease-in-out_infinite]",
      )}
    >
      <ShoppingCart className="size-5" />
      <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-extrabold leading-none">
        {count}
      </span>
    </button>
  );
}
