import { ReviewsTable } from "@/components/dashboard/reviews-table";

export default function AdminReviewsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Reviews</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Toggle which customer reviews appear on the home page. Off hides a
          review from the public section; it stays in the customer account.
        </p>
      </div>
      <ReviewsTable />
    </div>
  );
}
