"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, LogOut, Menu, Package, Percent, Plus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useSuperAdminAuth } from "./super-admin-shell";

const navItems = [
  {
    href: "/dashboard/super-admin",
    label: "Listings",
    icon: LayoutList,
    exact: true,
  },
  {
    href: "/dashboard/super-admin/listings/new",
    label: "Add listing",
    icon: Plus,
    exact: false,
  },
  {
    href: "/dashboard/super-admin/orders",
    label: "Orders",
    icon: Package,
    exact: false,
  },
  {
    href: "/dashboard/super-admin/promos",
    label: "Promo codes",
    icon: Percent,
    exact: false,
  },
  {
    href: "/dashboard/super-admin/reviews",
    label: "Reviews",
    icon: Star,
    exact: false,
  },
];

export function SuperAdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useSuperAdminAuth();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#1a3d2e] text-[#7dcea0]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0f1419] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#7dcea0]">
            Super Admin
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </p>
        </div>
        {nav}
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[#0f1419] text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#7dcea0]">
                  Super Admin
                </p>
                <p className="mt-0.5 font-semibold">{siteConfig.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <div className="border-t border-white/10 p-4">
              <p className="truncate text-xs text-zinc-500">{user?.email}</p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-zinc-900">
              {pathname.startsWith("/dashboard/super-admin/reviews")
                ? "Reviews"
                : pathname.startsWith("/dashboard/super-admin/promos")
                  ? "Promo codes"
                  : pathname.startsWith("/dashboard/super-admin/orders")
                    ? "Orders"
                    : "Marketplace"}
            </h1>
            <p className="truncate text-xs text-zinc-500">
              {pathname.startsWith("/dashboard/super-admin/reviews")
                ? "Control home page review visibility"
                : pathname.startsWith("/dashboard/super-admin/promos")
                  ? "Create and manage discount codes"
                  : pathname.startsWith("/dashboard/super-admin/orders")
                    ? "Manage customer orders and fulfillment"
                    : "Manage inventory listings"}
            </p>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
