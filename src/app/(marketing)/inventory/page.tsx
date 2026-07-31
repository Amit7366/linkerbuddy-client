import { InventoryBrowser } from "@/components/marketing/inventory-browser";
import { ShortlistBar } from "@/components/marketing/shortlist-bar";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Full inventory",
  description:
    "Browse the full guest post inventory with Moz DA, Ahrefs DR, traffic, pricing, and instant TAT.",
  path: "/inventory",
});

export default function InventoryPage() {
  return (
    <>
      <InventoryBrowser />
      <ShortlistBar />
    </>
  );
}
