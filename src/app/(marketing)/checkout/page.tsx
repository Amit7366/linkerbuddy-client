import { CheckoutClient } from "@/components/checkout/checkout-client";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your marketplace order securely with Stripe.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <div className="pb-16">
      <CheckoutClient />
    </div>
  );
}
