import { CtaRequestsTable } from "@/components/dashboard/cta-requests-table";

export default function AdminCtaRequestsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">AI shortlists</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Every “Build my AI shortlist” submit, with Gemini picks. Update status
          as you follow up.
        </p>
      </div>
      <CtaRequestsTable />
    </div>
  );
}
