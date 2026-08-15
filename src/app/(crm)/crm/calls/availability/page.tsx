"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAvailability, putAvailability } from "@/lib/api/calls";
import { useSession } from "@/providers/session-provider";
import type { AvailabilityRule } from "@/types/call";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CrmAvailabilityPage() {
  const { loading: sessionLoading } = useSession();
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;
    void getAvailability()
      .then((data) => setRules(data.rules))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [sessionLoading]);

  function updateRule(dayOfWeek: number, field: "startTime" | "endTime", value: string) {
    setRules((current) => {
      const existing = current.find((rule) => rule.dayOfWeek === dayOfWeek);
      if (existing) {
        return current.map((rule) =>
          rule.dayOfWeek === dayOfWeek ? { ...rule, [field]: value } : rule,
        );
      }
      return [
        ...current,
        {
          id: `new-${dayOfWeek}`,
          dayOfWeek,
          startTime: field === "startTime" ? value : "10:00",
          endTime: field === "endTime" ? value : "18:00",
          timezone: "Asia/Dhaka",
        },
      ];
    });
  }

  function toggleDay(dayOfWeek: number) {
    setRules((current) => {
      if (current.some((rule) => rule.dayOfWeek === dayOfWeek)) {
        return current.filter((rule) => rule.dayOfWeek !== dayOfWeek);
      }
      return [
        ...current,
        {
          id: `new-${dayOfWeek}`,
          dayOfWeek,
          startTime: "10:00",
          endTime: "18:00",
          timezone: "Asia/Dhaka",
        },
      ];
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const saved = await putAvailability({
        rules: rules.map((rule) => ({
          dayOfWeek: rule.dayOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
          timezone: rule.timezone,
        })),
      });
      setRules(saved.rules);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/crm/calls" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Calls
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900">Call availability</h1>
      <p className="text-sm text-zinc-500">Hours are in Asia/Dhaka. Visitors see converted times.</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
        {DAYS.map((label, dayOfWeek) => {
          const rule = rules.find((item) => item.dayOfWeek === dayOfWeek);
          return (
            <div key={label} className="flex flex-wrap items-center gap-3">
              <label className="flex w-20 items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={Boolean(rule)}
                  onChange={() => toggleDay(dayOfWeek)}
                />
                {label}
              </label>
              {rule ? (
                <>
                  <input
                    type="time"
                    className="rounded border border-zinc-300 px-2 py-1 text-sm"
                    value={rule.startTime}
                    onChange={(e) => updateRule(dayOfWeek, "startTime", e.target.value)}
                  />
                  <span className="text-zinc-400">to</span>
                  <input
                    type="time"
                    className="rounded border border-zinc-300 px-2 py-1 text-sm"
                    value={rule.endTime}
                    onChange={(e) => updateRule(dayOfWeek, "endTime", e.target.value)}
                  />
                </>
              ) : (
                <span className="text-sm text-zinc-400">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save hours"}
      </button>
    </div>
  );
}
