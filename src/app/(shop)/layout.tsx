import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Shop",
  description: "Checkout and cart for marketplace placements.",
  path: "/checkout",
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-ink">
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-muted">
            <Link href="/#marketplace" className="hover:text-ink">
              Marketplace
            </Link>
            <Link href="/account/orders" className="hover:text-ink">
              Orders
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_40%)]">
        {children}
      </main>
    </>
  );
}
