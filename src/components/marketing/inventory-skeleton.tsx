"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InventoryRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mb-2.5 grid grid-cols-3 gap-3.5 rounded-xl border border-line bg-card p-[15px] tablet:mb-0 tablet:min-h-[65px] tablet:grid-cols-[1.45fr_0.65fr_0.28fr_0.28fr_0.65fr_0.6fr_0.55fr_0.45fr_0.75fr] tablet:items-center tablet:gap-0 tablet:rounded-none tablet:border-0 tablet:border-t tablet:border-line tablet:px-[15px] tablet:py-0",
        className,
      )}
      aria-hidden
    >
      <div className="col-span-3 flex items-center gap-2.5 tablet:col-span-1">
        <Skeleton className="size-[25px] rounded-[7px]" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-8" />
      <Skeleton className="h-3 w-8" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="hidden h-3 w-12 tablet:block" />
      <Skeleton className="col-span-3 h-8 rounded-lg tablet:col-span-1" />
    </div>
  );
}

export function InventorySkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading placements">
      {Array.from({ length: count }).map((_, i) => (
        <InventoryRowSkeleton key={i} />
      ))}
    </div>
  );
}
