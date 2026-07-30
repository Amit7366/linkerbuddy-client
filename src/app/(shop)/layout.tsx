import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { shopNav } from "@/config/nav";

export const metadata = buildMetadata({
  title: "Shop",
  description: "Browse our products. Phase 2 e-commerce.",
  path: "/products",
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-bold">
            {siteConfig.name}
          </Link>
          <nav className="flex gap-4">
            {shopNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-zinc-600">
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <div className="bg-amber-50 py-2 text-center text-sm text-amber-800">
        Phase 2 — E-commerce placeholder
      </div>
    </>
  );
}
