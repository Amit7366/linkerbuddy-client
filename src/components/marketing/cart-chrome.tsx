"use client";

import { CartDrawer } from "@/components/marketing/cart-drawer";
import { CartFloatButton } from "@/components/marketing/cart-float-button";
import { ShortlistBar } from "@/components/marketing/shortlist-bar";

/** Home/inventory chrome: bottom bar OR float (never both) + shared drawer */
export function CartChrome() {
  return (
    <>
      <ShortlistBar />
      <CartFloatButton />
      <CartDrawer />
    </>
  );
}
