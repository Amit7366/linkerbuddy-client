import { InventoryBrowser } from "@/components/marketing/inventory-browser";
import { ShortlistBar } from "@/components/marketing/shortlist-bar";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildLocalizedMetadata({ locale, page: "inventory", path: "/inventory" });
}

export default function InventoryPage() {
  return (
    <>
      <InventoryBrowser />
      <ShortlistBar />
    </>
  );
}
