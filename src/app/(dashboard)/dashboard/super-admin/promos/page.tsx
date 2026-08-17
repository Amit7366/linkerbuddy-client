import { PromoCodesTable } from "@/components/dashboard/promo-codes-table";

export default function AdminPromosPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Promo codes</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Create percent or fixed discounts, then apply them on an order in Super Admin.
        </p>
      </div>
      <PromoCodesTable />
    </div>
  );
}
