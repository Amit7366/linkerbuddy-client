"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { CALL_CHANNELS, CALL_PURPOSES, MONTHLY_BUDGETS } from "@/config/booking";
import type { CallChannel, CallPurpose, MonthlyBudget } from "@/config/booking";
import { createCall, listCallSlots } from "@/lib/api/calls";
import { downloadIcs } from "@/lib/download-ics";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types/call";

const inputClass =
  "mt-1.5 flex h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25";

function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatSlot(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function upcomingDays(count = 14) {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const next = new Date(start);
    next.setDate(start.getDate() + i);
    days.push(next);
  }
  return days;
}

export function ScheduleCallForm() {
  const timezone = useMemo(() => visitorTimeZone(), []);
  const days = useMemo(() => upcomingDays(), []);
  const [purpose, setPurpose] = useState<CallPurpose>("GENERAL");
  const [channel, setChannel] = useState<CallChannel>("MEET");
  const [selectedDay, setSelectedDay] = useState(dateKey(days[0]!));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    monthlyBudget: "" as MonthlyBudget | "",
    notes: "",
    privacyAccepted: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<{
    localTime: string;
    ics?: string;
    manageToken: string;
    meetingUrl: string | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSlotsLoading(true);
    setStartsAt(null);
    void listCallSlots(selectedDay, timezone)
      .then((data) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch((err) => {
        if (!cancelled) {
          setSlots([]);
          setError(err instanceof Error ? err.message : "Could not load times");
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDay, timezone]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startsAt) {
      setError("Pick a time that works for you");
      return;
    }
    if (!form.privacyAccepted) {
      setError("Please agree to the privacy policy");
      return;
    }

    setLoading(true);
    try {
      const call = await createCall({
        startsAt,
        timezone,
        channel,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        website: form.website || undefined,
        monthlyBudget: form.monthlyBudget || undefined,
        purpose,
        notes: form.notes || undefined,
        privacyAccepted: true,
      });
      setBooked({
        localTime: call.localTime ?? formatSlot(call.startsAt, timezone),
        ics: call.ics,
        manageToken: call.manageToken,
        meetingUrl: call.meetingUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book that time");
    } finally {
      setLoading(false);
    }
  }

  if (booked) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-green/30 bg-green/10 p-5">
          <p className="m-0 text-lg font-bold text-ink">You&apos;re booked</p>
          <p className="mt-2 m-0 text-sm text-muted">
            Strategy call: <span className="font-semibold text-ink">{booked.localTime}</span>
          </p>
          {booked.meetingUrl ? (
            <a
              href={booked.meetingUrl}
              className="mt-2 inline-block text-sm font-semibold text-brand no-underline hover:underline"
            >
              Join / contact link
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {booked.ics ? (
            <Button type="button" onClick={() => downloadIcs(booked.ics!)}>
              Download calendar invite
            </Button>
          ) : null}
          <ButtonLink variant="ghost" href={`/schedule/${booked.manageToken}`}>
            Manage booking
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 phablet:grid-cols-2">
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="purpose">
            Call purpose
          </label>
          <select
            id="purpose"
            className={inputClass}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as CallPurpose)}
          >
            {CALL_PURPOSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="channel">
            How should we talk?
          </label>
          <select
            id="channel"
            className={inputClass}
            value={channel}
            onChange={(e) => setChannel(e.target.value as CallChannel)}
          >
            {CALL_CHANNELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="m-0 text-[13px] font-semibold text-ink">Pick a day</p>
        <p className="mt-1 mb-2 text-[12px] text-muted">Times shown in {timezone}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const key = dateKey(day);
            const selected = key === selectedDay;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(key)}
                className={cn(
                  "min-w-[72px] rounded-xl border px-3 py-2 text-left",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-surface text-ink hover:border-brand/40",
                )}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wide opacity-80">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="block text-sm font-semibold">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 m-0 text-[13px] font-semibold text-ink">Available times (30 min)</p>
        {slotsLoading ? (
          <p className="text-sm text-muted">Loading times…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted">No times on this day. Try another date.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 phablet:grid-cols-4">
            {slots.map((slot) => {
              const selected = startsAt === slot.start;
              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => setStartsAt(slot.start)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-[13px] font-semibold",
                    selected
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-card text-ink hover:border-brand/40",
                  )}
                >
                  {formatSlot(slot.start, timezone)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 phablet:grid-cols-2">
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-name">
            Name
          </label>
          <input
            id="call-name"
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-email">
            Email
          </label>
          <input
            id="call-email"
            type="email"
            required
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-4 phablet:grid-cols-2">
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-phone">
            Phone
          </label>
          <input
            id="call-phone"
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-company">
            Company
          </label>
          <input
            id="call-company"
            className={inputClass}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-4 phablet:grid-cols-2">
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-site">
            Website
          </label>
          <input
            id="call-site"
            type="url"
            placeholder="https://"
            className={inputClass}
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-ink" htmlFor="call-budget">
            Monthly link budget
          </label>
          <select
            id="call-budget"
            className={inputClass}
            value={form.monthlyBudget}
            onChange={(e) =>
              setForm({ ...form, monthlyBudget: e.target.value as MonthlyBudget | "" })
            }
          >
            <option value="">Select a range</option>
            {MONTHLY_BUDGETS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[13px] font-semibold text-ink" htmlFor="call-notes">
          Notes
        </label>
        <textarea
          id="call-notes"
          rows={3}
          className={cn(inputClass, "h-auto py-3")}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      <label className="flex items-start gap-2 text-[13px] text-muted">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-[var(--blue)]"
          checked={form.privacyAccepted}
          onChange={(e) => setForm({ ...form, privacyAccepted: e.target.checked })}
        />
        <span>
          I agree to the{" "}
          <a href="/privacy" className="font-semibold text-brand no-underline hover:underline">
            privacy policy
          </a>
        </span>
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Booking..." : "Schedule call"}
      </Button>
    </form>
  );
}
