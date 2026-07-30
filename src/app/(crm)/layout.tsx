import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { crmNav } from "@/config/nav";

export const metadata = buildMetadata({ title: "CRM", noIndex: true });

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="w-64 border-r border-zinc-200 bg-zinc-900 text-white">
        <div className="p-4 font-bold">{siteConfig.name} CRM</div>
        <nav className="space-y-1 px-2">
          {crmNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <p className="text-sm text-zinc-500">Phase 3 — Staff dashboard</p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
