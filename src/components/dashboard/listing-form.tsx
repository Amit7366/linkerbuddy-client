"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createMarketplaceListing,
  updateMarketplaceListing,
  type MarketplaceListingInput,
} from "@/lib/api/marketplace";
import type { SiteListing } from "@/config/landing";

const schema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i,
      "Enter a valid domain",
    ),
  niche: z.string().min(1, "Niche is required"),
  da: z.coerce.number().int().min(0).max(100),
  dr: z.coerce.number().int().min(0).max(100),
  traffic: z.coerce.number().int().min(0),
  country: z.string().min(1, "Country is required"),
  maxDofollow: z.coerce.number().int().min(0).max(100),
  guest: z.coerce.number().int().min(0),
  insert: z.coerce.number().int().min(0),
  tat: z.string().min(1, "TAT is required"),
  owner: z.enum(["Admin", "Partner"]),
  trend: z.enum(["Rising", "Stable"]),
});

type FormState = {
  domain: string;
  niche: string;
  da: string;
  dr: string;
  traffic: string;
  country: string;
  maxDofollow: string;
  guest: string;
  insert: string;
  tat: string;
  owner: "Admin" | "Partner";
  trend: "Rising" | "Stable";
};

function toForm(initial?: SiteListing): FormState {
  return {
    domain: initial?.domain ?? "",
    niche: initial?.niche ?? "General",
    da: String(initial?.da ?? 0),
    dr: String(initial?.dr ?? 0),
    traffic: String(initial?.traffic ?? 0),
    country: initial?.country ?? "India",
    maxDofollow: String(initial?.maxDofollow ?? 1),
    guest: String(initial?.guest ?? 0),
    insert: String(initial?.insert ?? 0),
    tat: initial?.tat ?? "Instant",
    owner: initial?.owner ?? "Admin",
    trend: initial?.trend ?? "Stable",
  };
}

const fields: Array<{
  key: keyof FormState;
  label: string;
  type?: string;
}> = [
  { key: "domain", label: "Domain" },
  { key: "niche", label: "Niche" },
  { key: "country", label: "Country" },
  { key: "da", label: "DA", type: "number" },
  { key: "dr", label: "DR", type: "number" },
  { key: "traffic", label: "Traffic", type: "number" },
  { key: "maxDofollow", label: "Max dofollow", type: "number" },
  { key: "guest", label: "Guest post price", type: "number" },
  { key: "insert", label: "Link insert price", type: "number" },
  { key: "tat", label: "TAT" },
];

interface ListingFormProps {
  mode: "create" | "edit";
  initial?: SiteListing;
}

export function ListingForm({ mode, initial }: ListingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    const payload = parsed.data as MarketplaceListingInput;
    setLoading(true);
    try {
      if (mode === "create") {
        await createMarketplaceListing(payload);
      } else if (initial) {
        await updateMarketplaceListing(initial.id, payload);
      }
      router.push("/dashboard/super-admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          {mode === "create" ? "New listing" : `Edit ${initial?.domain}`}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          All fields are required. Domain must be unique.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {field.label}
            </span>
            <input
              type={field.type ?? "text"}
              value={form[field.key]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
              required
            />
          </label>
        ))}

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Owner
          </span>
          <select
            value={form.owner}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                owner: e.target.value as "Admin" | "Partner",
              }))
            }
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          >
            <option value="Admin">Admin</option>
            <option value="Partner">Partner</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Trend
          </span>
          <select
            value={form.trend}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                trend: e.target.value as "Rising" | "Stable",
              }))
            }
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none ring-[#3d9a6a] focus:ring-2"
          >
            <option value="Rising">Rising</option>
            <option value="Stable">Stable</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/dashboard/super-admin")}
          className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-lg bg-[#1a3d2e] px-5 text-sm font-medium text-white hover:bg-[#245240] disabled:opacity-60"
        >
          {loading ? "Saving…" : mode === "create" ? "Create listing" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
