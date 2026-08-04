"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccountAuth } from "@/components/account/account-shell";
import { updateBillingProfile } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, refreshUser } = useAccountAuth();
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name ?? "");
  }, [user.name]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateBillingProfile({ name: name.trim() || null });
      await refreshUser();
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account identity. Billing and delivery details live under{" "}
          <Link
            href="/account/settings/billing"
            className="font-semibold text-brand underline"
          >
            Delivery addresses
          </Link>
          .
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

        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <p className="text-[11px] font-bold tracking-wide text-muted uppercase">
            Account type
          </p>
          <p className="mt-1 text-[15px] font-semibold text-ink">
            {user.role === "CUSTOMER" ? "Customer" : user.role}
          </p>
        </div>

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
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </div>
  );
}
