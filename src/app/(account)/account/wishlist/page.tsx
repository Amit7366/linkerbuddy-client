"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Favorite items</h1>
        <p className="mt-1 text-sm text-muted">
          Save marketplace sites you want to revisit later.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-line bg-card px-6 py-16 text-center shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-rose-500">
          <Heart className="size-5" />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">No favorites yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Wishlist saving is coming soon. Browse inventory and add sites to your cart
          in the meantime.
        </p>
        <ButtonLink href="/inventory" className="mt-6 inline-flex">
          Browse inventory
        </ButtonLink>
        <p className="mt-3 text-xs text-muted">
          Or go to{" "}
          <Link href="/#marketplace" className="font-semibold text-brand underline">
            marketplace
          </Link>
        </p>
      </div>
    </div>
  );
}
