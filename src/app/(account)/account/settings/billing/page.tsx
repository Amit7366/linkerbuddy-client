"use client";

import { useEffect, useState } from "react";
import { useAccountAuth } from "@/components/account/account-shell";
import { getBillingProfile, updateBillingProfile } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = {
  name: string;
  phone: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function BillingPage() {
  const { user, refreshUser } = useAccountAuth();
  const [form, setForm] = useState<FormState>({
    name: user.name ?? "",
    phone: user.phone ?? "",
    company: user.company ?? "",
    addressLine1: user.addressLine1 ?? "",
    addressLine2: user.addressLine2 ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    postalCode: user.postalCode ?? "",
    country: user.country ?? "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getBillingProfile()
      .then((profile) => {
        if (cancelled) return;
        setForm({
          name: profile.name ?? "",
          phone: profile.phone ?? "",
          company: profile.company ?? "",
          addressLine1: profile.addressLine1 ?? "",
          addressLine2: profile.addressLine2 ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          postalCode: profile.postalCode ?? "",
          country: profile.country ?? "",
        });
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateBillingProfile({
        name: form.name || null,
        phone: form.phone || null,
        company: form.company || null,
        addressLine1: form.addressLine1 || null,
        addressLine2: form.addressLine2 || null,
        city: form.city || null,
        state: form.state || null,
        postalCode: form.postalCode || null,
        country: form.country || null,
      });
      await refreshUser();
      setMessage("Delivery address saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted">Loading delivery address…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Delivery addresses
        </h1>
        <p className="mt-1 text-sm text-muted">
          These details autofill checkout billing. Email stays on your account.
        </p>
      </div>

      <form
        onSubmit={(e) => void onSave(e)}
        className="max-w-xl space-y-4 rounded-xl border border-line bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <p className="text-[11px] font-bold tracking-wide text-muted uppercase">
            Email
          </p>
          <p className="mt-1 text-[15px] font-semibold text-ink">{user.email}</p>
        </div>

        {(
          [
            ["name", "Full name"],
            ["phone", "Phone"],
            ["company", "Company"],
            ["addressLine1", "Address line 1"],
            ["addressLine2", "Address line 2"],
            ["city", "City"],
            ["state", "State / Province"],
            ["postalCode", "Postal code"],
            ["country", "Country"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              className="mt-1.5"
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}

        {message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save address"}
        </Button>
      </form>
    </div>
  );
}
