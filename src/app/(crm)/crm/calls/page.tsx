"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCalls, updateCall } from "@/lib/api/calls";
import { useSession } from "@/providers/session-provider";
import { CALL_CHANNELS, CALL_PURPOSES, labelFor } from "@/config/booking";
import type { CallStatus, ScheduledCall } from "@/types/call";

export default function CrmCallsPage() {
  const { loading: sessionLoading } = useSession();
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    void listCalls({ limit: 50 })
      .then((data) => setCalls(data.calls))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load calls"))
      .finally(() => setLoading(false));
  }, [sessionLoading]);

  async function setStatus(id: string, status: CallStatus) {
    const updated = await updateCall(id, { status });
    setCalls((current) => current.map((call) => (call.id === id ? { ...call, ...updated } : call)));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Calls</h1>
          <p className="mt-1 text-sm text-zinc-500">Upcoming and past strategy calls.</p>
        </div>
        <Link href="/crm/calls/availability" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
          Availability
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={6}>
                  No calls booked yet.
                </td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr key={call.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3">
                    {new Date(call.startsAt).toLocaleString()}
                    <div className="text-xs text-zinc-500">{call.timezone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/crm/leads/${call.leadId}`} className="font-semibold text-zinc-900">
                      {call.lead.name}
                    </Link>
                    {call.lead.highValue ? (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        HIGH VALUE
                      </span>
                    ) : null}
                    <div className="text-xs text-zinc-500">{call.lead.email}</div>
                  </td>
                  <td className="px-4 py-3">{labelFor(CALL_PURPOSES, call.lead.purpose)}</td>
                  <td className="px-4 py-3">{labelFor(CALL_CHANNELS, call.channel)}</td>
                  <td className="px-4 py-3">{call.status}</td>
                  <td className="px-4 py-3">
                    {call.status === "SCHEDULED" ? (
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="rounded border border-zinc-200 px-2 py-1 text-xs"
                          onClick={() => void setStatus(call.id, "COMPLETED")}
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          className="rounded border border-zinc-200 px-2 py-1 text-xs"
                          onClick={() => void setStatus(call.id, "NO_SHOW")}
                        >
                          No-show
                        </button>
                        <button
                          type="button"
                          className="rounded border border-zinc-200 px-2 py-1 text-xs"
                          onClick={() => void setStatus(call.id, "CANCELLED")}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
