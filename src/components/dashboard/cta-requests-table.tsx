"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import {
  listCtaRequests,
  updateCtaRequestStatus,
} from "@/lib/api/cta-requests";
import type {
  CtaAiStatus,
  CtaRequestAdmin,
  CtaRequestStatus,
} from "@/types/cta-request";
import { formatTraffic } from "@/config/landing";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

const STATUS_OPTIONS: { value: CtaRequestStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONVERTED", label: "Converted" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: CtaRequestStatus) {
  if (status === "CONVERTED") return "bg-emerald-50 text-emerald-800";
  if (status === "CONTACTED") return "bg-amber-50 text-amber-800";
  return "bg-zinc-100 text-zinc-700";
}

function aiClass(status: CtaAiStatus) {
  if (status === "READY") return "bg-indigo-50 text-indigo-800";
  if (status === "FAILED") return "bg-red-50 text-red-700";
  return "bg-zinc-100 text-zinc-600";
}

export function CtaRequestsTable() {
  const [requests, setRequests] = useState<CtaRequestAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CtaRequestStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<CtaRequestAdmin | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCtaRequests({
        page,
        limit: PAGE_SIZE,
        q: search || undefined,
        status: statusFilter || undefined,
      });
      setRequests(data.requests);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shortlist requests");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: string, status: CtaRequestStatus) {
    setUpdatingId(id);
    setError(null);
    try {
      const updated = await updateCtaRequestStatus(id, status);
      setRequests((current) =>
        current.map((row) => (row.id === id ? updated : row)),
      );
      setSelected((current) => (current?.id === id ? updated : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            placeholder="Search email, niche, budget…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as CtaRequestStatus | "");
          }}
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none ring-[#3d9a6a] focus:ring-2"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Niche</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">AI</th>
                <th className="px-4 py-3 font-medium">Picks</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    Loading…
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    No AI shortlist submissions yet
                  </td>
                </tr>
              ) : (
                requests.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer border-b border-zinc-50 last:border-0 hover:bg-zinc-50/80"
                    onClick={() => setSelected(row)}
                  >
                    <td className="px-4 py-3 text-zinc-600">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.niche}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.budget}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          aiClass(row.aiStatus),
                        )}
                      >
                        {row.aiStatus.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{row.pickCount}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={row.status}
                        disabled={updatingId === row.id}
                        onChange={(e) =>
                          void changeStatus(row.id, e.target.value as CtaRequestStatus)
                        }
                        className={cn(
                          "rounded-full border-0 px-2 py-1 text-[11px] font-semibold outline-none",
                          statusClass(row.status),
                        )}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-sm text-zinc-500">
          <span>
            {total} request{total === 1 ? "" : "s"}
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

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI shortlist
                </p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900">{selected.email}</h3>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {selected.niche} · {selected.budget} · {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
                aria-label="Close detail"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {selected.summary ? (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">{selected.summary}</p>
                  {selected.strategy ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                      {selected.strategy}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  {selected.aiStatus === "PENDING"
                    ? "Gemini analysis is still pending."
                    : "No AI summary was stored for this submit."}
                </p>
              )}

              {selected.tips.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Tips
                  </p>
                  <ul className="space-y-1.5">
                    {selected.tips.map((tip) => (
                      <li key={tip} className="text-sm text-zinc-600">
                        · {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Recommended sites ({selected.recommendations.length})
                </p>
                {selected.recommendations.length === 0 ? (
                  <p className="text-sm text-zinc-500">No site picks stored.</p>
                ) : (
                  <div className="space-y-2.5">
                    {selected.recommendations.map((site) => (
                      <article
                        key={`${site.siteId}-${site.domain}`}
                        className="rounded-xl border border-zinc-200 p-3.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-zinc-900">{site.domain}</p>
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                            {site.fitScore}% fit
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          {site.country} · {site.niche} · DR {site.dr} · DA {site.da} ·{" "}
                          {formatTraffic(site.traffic)} · ${site.guest}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{site.reason}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
