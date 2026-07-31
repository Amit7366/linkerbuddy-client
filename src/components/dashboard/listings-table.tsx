"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  deleteMarketplaceListing,
  listMarketplace,
} from "@/lib/api/marketplace";
import type { SiteListing } from "@/config/landing";
import { formatTraffic } from "@/config/landing";

const PAGE_SIZE = 15;

export function ListingsTable() {
  const [listings, setListings] = useState<SiteListing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMarketplace({
        q: search || undefined,
        page,
        limit: PAGE_SIZE,
        sort: "recommended",
      });
      setListings(data.listings);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: number, domain: string) {
    if (!window.confirm(`Delete listing “${domain}”? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteMarketplaceListing(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="relative flex-1 sm:max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(q.trim());
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search domain, niche, country…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          />
        </form>
        <Link
          href="/dashboard/super-admin/listings/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1a3d2e] px-4 text-sm font-medium text-white transition-colors hover:bg-[#245240]"
        >
          <Plus className="h-4 w-4" />
          Add listing
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Niche</th>
                <th className="px-4 py-3 font-medium">DA/DR</th>
                <th className="px-4 py-3 font-medium">Traffic</th>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    Loading…
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    No listings found
                  </td>
                </tr>
              ) : (
                listings.map((site) => (
                  <tr
                    key={site.id}
                    className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/80"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {site.domain}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{site.niche}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {site.da}/{site.dr}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {formatTraffic(site.traffic)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">${site.guest}</td>
                    <td className="px-4 py-3 text-zinc-600">{site.owner}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/super-admin/listings/${site.id}/edit`}
                          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                          aria-label={`Edit ${site.domain}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === site.id}
                          onClick={() => void handleDelete(site.id, site.domain)}
                          className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label={`Delete ${site.domain}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-sm text-zinc-500">
          <span>
            {total} listing{total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
