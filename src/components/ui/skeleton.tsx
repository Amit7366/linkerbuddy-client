import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("lb-skeleton", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-8 px-5 py-10" aria-busy="true" aria-label="Loading page">
      <div className="lb-container space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full max-w-xl" />
        <Skeleton className="h-12 w-full max-w-md" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
        <Skeleton className="mt-10 h-64 w-full rounded-[18px]" />
      </div>
      <div className="lb-container">
        <Skeleton className="h-20 w-full rounded-[14px]" />
      </div>
      <div className="lb-container grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}
