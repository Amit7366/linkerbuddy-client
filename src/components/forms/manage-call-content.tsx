"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cancelManagedCall, getManagedCall, listCallSlots, rescheduleManagedCall } from "@/lib/api/calls";
import { downloadIcs } from "@/lib/download-ics";
import { cn } from "@/lib/utils";
import type { ScheduledCall, TimeSlot } from "@/types/call";

function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ManageCallContent({ token }: { token: string }) {
  const timezone = useMemo(() => visitorTimeZone(), []);
  const [call, setCall] = useState<ScheduledCall | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(dateKey(new Date()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    void getManagedCall(token)
      .then(setCall)
      .catch((err) => setError(err instanceof Error ? err.message : "Booking not found"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!rescheduleOpen) return;
    void listCallSlots(selectedDay, timezone).then((data) => setSlots(data.slots));
  }, [rescheduleOpen, selectedDay, timezone]);

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const updated = await cancelManagedCall(token);
      setCall(updated);
      setRescheduleOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  async function pickSlot(startsAt: string) {
    setBusy(true);
    setError(null);
    try {
      const updated = await rescheduleManagedCall(token, { startsAt, timezone });
      setCall(updated);
      setRescheduleOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reschedule");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-20">
        <p className="text-muted">Loading booking…</p>
      </Container>
    );
  }

  if (!call) {
    return (
      <Container className="py-20">
        <h1 className="text-3xl font-bold text-ink">Booking not found</h1>
        <p className="mt-3 text-muted">{error}</p>
      </Container>
    );
  }

  const scheduled = call.status === "SCHEDULED";

  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl font-bold tracking-[-0.04em] text-ink">Your strategy call</h1>
      <p className="mt-3 text-muted">
        Status: <span className="font-semibold text-ink">{call.status}</span>
      </p>
      <p className="mt-2 text-lg font-semibold text-ink">
        {call.localTime ?? new Date(call.startsAt).toLocaleString()}
      </p>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {call.ics ? (
          <Button type="button" onClick={() => downloadIcs(call.ics!)}>
            Download calendar invite
          </Button>
        ) : null}
        {scheduled ? (
          <>
            <Button type="button" variant="ghost" onClick={() => setRescheduleOpen((v) => !v)}>
              Reschedule
            </Button>
            <Button type="button" variant="ghost" disabled={busy} onClick={() => void cancel()}>
              Cancel call
            </Button>
          </>
        ) : null}
      </div>

      {rescheduleOpen && scheduled ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-5">
          <p className="m-0 mb-3 text-sm font-semibold text-ink">Pick a new day</p>
          <input
            type="date"
            className="h-11 rounded-xl border border-line bg-surface px-3 text-sm"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                disabled={busy}
                onClick={() => void pickSlot(slot.start)}
                className={cn(
                  "rounded-xl border border-line px-2 py-2 text-sm font-semibold text-ink hover:border-brand",
                )}
              >
                {new Date(slot.start).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: timezone,
                })}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
