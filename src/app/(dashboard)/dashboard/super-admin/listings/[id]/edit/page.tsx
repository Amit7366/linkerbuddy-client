"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ListingForm } from "@/components/dashboard/listing-form";
import { getMarketplaceListing } from "@/lib/api/marketplace";
import type { SiteListing } from "@/config/landing";

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<SiteListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      router.replace("/dashboard/super-admin");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const data = await getMarketplaceListing(id);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!listing) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3d9a6a] border-t-transparent" />
      </div>
    );
  }

  return <ListingForm mode="edit" initial={listing} />;
}
