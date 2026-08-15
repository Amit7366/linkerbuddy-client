"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLead, replyToLead } from "@/lib/api/leads";
import { useSession } from "@/providers/session-provider";
import type { Lead } from "@/types/lead";
import { CALL_PURPOSES, MONTHLY_BUDGETS, labelFor } from "@/config/booking";

export default function CrmLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const { loading: sessionLoading } = useSession();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (sessionLoading || !params.id) return;
    void getLead(params.id)
      .then((data) => {
        setLead(data);
        setSubject(data.subject ? `Re: ${data.subject}` : `Re: your Linkerbuddy inquiry`);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load lead"));
  }, [params.id, sessionLoading]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    setSending(true);
    setError(null);
    try {
      await replyToLead(lead.id, { subject, body });
      const refreshed = await getLead(lead.id);
      setLead(refreshed);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reply");
    } finally {
      setSending(false);
    }
  }

  if (!lead && !error) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  if (!lead) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/crm/leads" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← All leads
      </Link>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{lead.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">{lead.email}</p>
          </div>
          {lead.highValue ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              HIGH VALUE
            </span>
          ) : null}
        </div>
        <dl className="mt-5 grid gap-3 text-sm phablet:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Subject</dt>
            <dd className="font-medium">{lead.subject || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Phone</dt>
            <dd className="font-medium">{lead.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Company</dt>
            <dd className="font-medium">{lead.company || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Website</dt>
            <dd className="font-medium">{lead.website || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Purpose</dt>
            <dd className="font-medium">{labelFor(CALL_PURPOSES, lead.purpose)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Budget</dt>
            <dd className="font-medium">{labelFor(MONTHLY_BUDGETS, lead.monthlyBudget)}</dd>
          </div>
        </dl>
        {lead.message ? (
          <p className="mt-5 whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm text-zinc-800">
            {lead.message}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold">Reply by email</h2>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <form onSubmit={sendReply} className="mt-4 space-y-3">
          <input
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            rows={6}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Write your reply…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send reply"}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          {(lead.replies ?? []).map((reply) => (
            <div key={reply.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-sm">
              <p className="m-0 font-semibold">{reply.subject}</p>
              <p className="mt-1 whitespace-pre-wrap text-zinc-700">{reply.body}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {new Date(reply.createdAt).toLocaleString()}
                {reply.sentBy?.email ? ` · ${reply.sentBy.email}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
