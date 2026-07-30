import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { accountNav } from "@/config/nav";

export const metadata = buildMetadata({ title: "Account", noIndex: true });

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-bold">
            {siteConfig.name}
          </Link>
          <span className="text-sm text-zinc-500">My Account</span>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="w-48 shrink-0">
          <nav className="space-y-2">
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-zinc-600 hover:text-zinc-900"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 rounded-xl border border-zinc-200 bg-white p-8">{children}</main>
      </div>
    </div>
  );
}
