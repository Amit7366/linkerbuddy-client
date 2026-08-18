"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, Search, X } from "lucide-react";
import { listCalls, updateCall } from "@/lib/api/calls";
import { CALL_CHANNELS, CALL_PURPOSES, MONTHLY_BUDGETS, labelFor } from "@/config/booking";
import type { CallStatus, ScheduledCall } from "@/types/call";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

const STATUS_OPTIONS: { value: CallStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No-show" },
];

function formatWhen(value: string, timeZone: string) {
  return new Date(value).toLocaleString(undefined, {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status: CallStatus) {
  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-800";
  if (status === "SCHEDULED") return "bg-indigo-50 text-indigo-800";
  if (status === "NO_SHOW") return "bg-red-50 text-red-700";
  return "bg-zinc-100 text-zinc-600";
}

export function ScheduledCallsTable() {
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CallStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ScheduledCall | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCalls({
        page,
        limit: PAGE_SIZE,
        q: search || undefined,
        status: statusFilter || undefined,
      });
      setCalls(data.calls);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scheduled calls");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  function openDetail(call: ScheduledCall) {
    setSelected(call);
    setNotes(call.notes ?? "");
  }

  async function changeStatus(id: string, status: CallStatus) {
    setUpdatingId(id);
    setError(null);
    try {
      const updated = await updateCall(id, { status });
      setCalls((current) => current.map((row) => (row.id === id ? { ...row, ...updated } : row)));
      setSelected((current) => (current?.id === id ? { ...current, ...updated } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSavingNotes(true);
    setError(null);
    try {
      const updated = await updateCall(selected.id, { notes });
      setCalls((current) =>
        current.map((row) => (row.id === selected.id ? { ...row, ...updated } : row)),
      );
      setSelected((current) => (current ? { ...current, ...updated } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save notes");
    } finally {
      setSavingNotes(false);
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
            placeholder="Search name, email, phone, company…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as CallStatus | "");
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
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    Loading…
                  </td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    No scheduled calls yet
                  </td>
                </tr>
              ) : (
                calls.map((call) => (
                  <tr
                    key={call.id}
                    className="cursor-pointer border-b border-zinc-50 last:border-0 hover:bg-zinc-50/80"
                    onClick={() => openDetail(call)}
                  >
                    <td className="px-4 py-3 text-zinc-600">
                      {formatWhen(call.startsAt, call.timezone)}
                      <div className="text-[11px] text-zinc-400">{call.timezone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900">{call.lead.name}</span>
                        {call.lead.highValue ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            HIGH VALUE
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-zinc-500">{call.lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {labelFor(CALL_PURPOSES, call.lead.purpose)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {labelFor(CALL_CHANNELS, call.channel)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {labelFor(MONTHLY_BUDGETS, call.lead.monthlyBudget)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={call.status}
                        disabled={updatingId === call.id}
                        onChange={(e) => void changeStatus(call.id, e.target.value as CallStatus)}
                        className={cn(
                          "rounded-full border-0 px-2 py-1 text-[11px] font-semibold outline-none",
                          statusClass(call.status),
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
            {total} call{total === 1 ? "" : "s"}
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
                  <Phone className="h-3.5 w-3.5" />
                  Scheduled call
                </p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900">{selected.lead.name}</h3>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {formatWhen(selected.startsAt, selected.timezone)} · {selected.timezone}
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
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Email
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${selected.lead.email}`}
                      className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                    >
                      {selected.lead.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Phone
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {selected.lead.phone ? (
                      <a
                        href={`tel:${selected.lead.phone}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {selected.lead.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Company
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {selected.lead.company || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Website
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {selected.lead.website ? (
                      <a
                        href={selected.lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {selected.lead.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Purpose
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {labelFor(CALL_PURPOSES, selected.lead.purpose)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Monthly budget
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {labelFor(MONTHLY_BUDGETS, selected.lead.monthlyBudget)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Channel
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {labelFor(CALL_CHANNELS, selected.channel)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Join / contact
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-900">
                    {selected.meetingUrl ? (
                      <a
                        href={selected.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {selected.meetingUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>

              <div>
                <label
                  htmlFor="call-notes"
                  className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
                >
                  Notes
                </label>
                <textarea
                  id="call-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none ring-[#3d9a6a] focus:ring-2"
                  placeholder="Internal notes from this call…"
                />
                <button
                  type="button"
                  disabled={savingNotes}
                  onClick={() => void saveNotes()}
                  className="mt-2 rounded-lg bg-[#1a3d2e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#245240] disabled:opacity-50"
                >
                  {savingNotes ? "Saving…" : "Save notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
