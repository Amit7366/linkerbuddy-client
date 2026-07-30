import Link from "next/link";
import { siteConfig } from "@/config/site";
import { marketingNav } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-zinc-900">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-zinc-600">{siteConfig.description}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Navigation</p>
          <ul className="mt-3 space-y-2">
            {marketingNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-zinc-600 hover:text-zinc-900">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Get started</p>
          <p className="mt-3 text-sm text-zinc-600">
            Ready to grow? Contact us or create an account today.
          </p>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
