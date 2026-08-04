import { OrdersTable } from "@/components/dashboard/orders-table";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Orders</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Review payments, update fulfillment status, and correct order details.
        </p>
      </div>
      <OrdersTable />
    </div>
  );
}
