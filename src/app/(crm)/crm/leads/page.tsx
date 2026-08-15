"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listLeads } from "@/lib/api/leads";
import { useSession } from "@/providers/session-provider";
import type { Lead } from "@/types/lead";
import { cn } from "@/lib/utils";

export default function CrmLeadsPage() {
  const { loading: sessionLoading } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    void listLeads({ limit: 50 })
      .then((data) => setLeads(data.leads))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load leads"))
      .finally(() => setLoading(false));
  }, [sessionLoading]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Leads</h1>
        <p className="mt-1 text-sm text-zinc-500">Contact form submissions and booked calls.</p>
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
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={5}>
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/crm/leads/${lead.id}`} className="font-semibold text-zinc-900">
                      {lead.name}
                    </Link>
                    <div className="text-xs text-zinc-500">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{lead.subject || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold">
                      {lead.source === "schedule_call" ? "Call" : "Form"}
                    </span>
                    {lead.highValue ? (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800">
                        HIGH VALUE
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px] font-semibold",
                        lead.status === "NEW"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-zinc-100 text-zinc-700",
                      )}
                    >
                      {lead.status}
                    </span>
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
