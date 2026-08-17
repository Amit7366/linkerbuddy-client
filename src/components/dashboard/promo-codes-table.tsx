"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPromo,
  deletePromo,
  listPromos,
  updatePromo,
  type PromoCode,
  type PromoDiscountType,
  type PromoPayload,
} from "@/lib/api/promos";
import { formatCents } from "@/lib/orders-ui";
import { cn } from "@/lib/utils";

type FormState = {
  code: string;
  description: string;
  type: PromoDiscountType;
  value: string;
  minOrder: string;
  maxDiscount: string;
  maxUses: string;
  endsAt: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  code: "",
  description: "",
  type: "PERCENT",
  value: "10",
  minOrder: "0",
  maxDiscount: "",
  maxUses: "",
  endsAt: "",
  active: true,
});

function dollarsToCents(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(amount * 100);
}

function toPayload(form: FormState): PromoPayload {
  const percent = form.type === "PERCENT";
  return {
    code: form.code.trim().toUpperCase(),
    description: form.description.trim() || null,
    type: form.type,
    value: percent ? Math.round(Number(form.value) || 0) : dollarsToCents(form.value),
    minOrderCents: dollarsToCents(form.minOrder),
    maxDiscountCents: form.maxDiscount.trim() ? dollarsToCents(form.maxDiscount) : null,
    maxUses: form.maxUses.trim() ? Math.round(Number(form.maxUses)) : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    active: form.active,
  };
}

function fromPromo(promo: PromoCode): FormState {
  return {
    code: promo.code,
    description: promo.description ?? "",
    type: promo.type,
    value:
      promo.type === "PERCENT"
        ? String(promo.value)
        : (promo.value / 100).toFixed(2),
    minOrder: (promo.minOrderCents / 100).toFixed(2),
    maxDiscount: promo.maxDiscountCents != null ? (promo.maxDiscountCents / 100).toFixed(2) : "",
    maxUses: promo.maxUses != null ? String(promo.maxUses) : "",
    endsAt: promo.endsAt ? promo.endsAt.slice(0, 10) : "",
    active: promo.active,
  };
}

export function PromoCodesTable() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPromos({ limit: 100 });
      setPromos(data.promos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm());
  }

  function openEdit(promo: PromoCode) {
    setCreating(false);
    setEditing(promo);
    setForm(fromPromo(promo));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(form);
      if (editing) await updatePromo(editing.id, payload);
      else await createPromo(payload);
      setCreating(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save promo code");
    } finally {
      setSaving(false);
    }
  }

  async function remove(promo: PromoCode) {
    if (!window.confirm(`Delete promo ${promo.code}? Orders that used it keep the discount snapshot.`)) {
      return;
    }
    setSaving(true);
    try {
      await deletePromo(promo.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete promo");
    } finally {
      setSaving(false);
    }
  }

  const showForm = creating || Boolean(editing);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-white"
        >
          New promo code
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <form
          className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <h3 className="sm:col-span-2 text-sm font-bold text-zinc-900">
            {editing ? `Edit ${editing.code}` : "Create promo code"}
          </h3>
          <label className="text-xs text-zinc-500">
            Code
            <input
              required
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm uppercase"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Type
            <select
              value={form.type}
              onChange={(e) =>
                setForm((p) => ({ ...p, type: e.target.value as PromoDiscountType }))
              }
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            >
              <option value="PERCENT">Percent off</option>
              <option value="FIXED">Fixed $ amount</option>
            </select>
          </label>
          <label className="text-xs text-zinc-500">
            {form.type === "PERCENT" ? "Percent" : "Amount ($)"}
            <input
              required
              value={form.value}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Min order ($)
            <input
              value={form.minOrder}
              onChange={(e) => setForm((p) => ({ ...p, minOrder: e.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Max discount ($)
            <input
              value={form.maxDiscount}
              onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))}
              placeholder="Optional cap"
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Max uses
            <input
              value={form.maxUses}
              onChange={(e) => setForm((p) => ({ ...p, maxUses: e.target.value }))}
              placeholder="Unlimited"
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Expires
            <input
              type="date"
              value={form.endsAt}
              onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="sm:col-span-2 text-xs text-zinc-500">
            Description
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-zinc-200 px-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
            />
            Active
          </label>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min / uses</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : promos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No promo codes yet.
                </td>
              </tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo.id} className="border-b border-zinc-100">
                  <td className="px-4 py-3">
                    <p className="font-mono font-bold text-zinc-900">{promo.code}</p>
                    <p className="text-xs text-zinc-500">{promo.description || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {promo.type === "PERCENT" ? `${promo.value}%` : formatCents(promo.value)}
                    {promo.maxDiscountCents != null ? (
                      <span className="block text-xs text-zinc-500">
                        cap {formatCents(promo.maxDiscountCents)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    Min {formatCents(promo.minOrderCents)}
                    <span className="block text-xs">
                      {promo.usedCount}
                      {promo.maxUses != null ? ` / ${promo.maxUses}` : " uses"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                        promo.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500",
                      )}
                    >
                      {promo.active ? "Active" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(promo)}
                      className="mr-2 text-sm font-semibold text-zinc-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(promo)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
