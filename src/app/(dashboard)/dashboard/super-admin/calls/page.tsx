import { ScheduledCallsTable } from "@/components/dashboard/scheduled-calls-table";

export default function AdminScheduledCallsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Scheduled calls</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Every “Schedule a call” booking. Open a row for contact details, then
          update status as you take the call.
        </p>
      </div>
      <ScheduledCallsTable />
    </div>
  );
}
