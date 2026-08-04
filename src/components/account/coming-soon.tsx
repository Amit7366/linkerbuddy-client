"use client";

export function AccountComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="rounded-xl border border-dashed border-line bg-card px-6 py-16 text-center shadow-sm">
        <p className="text-sm font-semibold text-ink">Coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          This section is part of the account experience and will be available in a
          future update.
        </p>
      </div>
    </div>
  );
}
