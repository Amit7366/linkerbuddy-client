"use client";

import { useCallback, useEffect, useState } from "react";
import { createReview, getMyReviews } from "@/lib/api/reviews";
import type { PendingReviewOrder, UserReview } from "@/types/review";
import { formatCents } from "@/lib/orders-ui";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  StarRatingDisplay,
  StarRatingInput,
} from "@/components/account/star-rating";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingReviewOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyReviews();
      setReviews(data.reviews);
      setPendingOrders(data.pendingOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openForm(orderId: string) {
    setActiveOrderId(orderId);
    setRating(0);
    setDescription("");
  }

  function closeForm() {
    setActiveOrderId(null);
    setRating(0);
    setDescription("");
  }

  async function handleSubmit(orderId: string) {
    if (rating < 1) {
      showToast("Please select a star rating");
      return;
    }
    if (description.trim().length < 20) {
      showToast("Please write at least 20 characters");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createReview({
        orderId,
        rating,
        description: description.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
      closeForm();
      showToast("Review submitted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Reviews</h1>
        <p className="mt-1 text-sm text-muted">
          Rate completed placements and share feedback for the home page.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Awaiting review</h2>
          <p className="mt-0.5 text-sm text-muted">
            Completed orders you have not reviewed yet.
          </p>
        </div>

        {loading ? (
          <p className="rounded-xl border border-line bg-card px-5 py-10 text-sm text-muted">
            Loading…
          </p>
        ) : pendingOrders.length === 0 ? (
          <p className="rounded-xl border border-line bg-card px-5 py-10 text-sm text-muted">
            No completed orders waiting for a review.
          </p>
        ) : (
          <ul className="space-y-3">
            {pendingOrders.map((order) => {
              const open = activeOrderId === order.id;
              return (
                <li
                  key={order.id}
                  className="rounded-xl border border-line bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-muted">
                        {formatDate(order.createdAt)} ·{" "}
                        {formatCents(order.totalCents, order.currency)}
                      </p>
                    </div>
                    {!open ? (
                      <Button size="sm" onClick={() => openForm(order.id)}>
                        Write review
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={closeForm}>
                        Cancel
                      </Button>
                    )}
                  </div>

                  {open ? (
                    <form
                      className="mt-5 space-y-4 border-t border-line pt-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void handleSubmit(order.id);
                      }}
                    >
                      <StarRatingInput
                        value={rating}
                        onChange={setRating}
                        disabled={submitting}
                      />
                      <div className="space-y-2">
                        <label
                          htmlFor={`review-desc-${order.id}`}
                          className="text-sm font-semibold text-ink"
                        >
                          Description
                        </label>
                        <textarea
                          id={`review-desc-${order.id}`}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          disabled={submitting}
                          rows={4}
                          maxLength={1000}
                          placeholder="Tell others about your experience with this placement order…"
                          className={cn(
                            "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink",
                            "placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
                          )}
                        />
                        <p className="text-xs text-muted">
                          {description.trim().length}/1000 · min 20 characters
                        </p>
                      </div>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit review"}
                      </Button>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Your reviews</h2>
          <p className="mt-0.5 text-sm text-muted">
            Feedback you have already submitted.
          </p>
        </div>

        {loading ? (
          <p className="rounded-xl border border-line bg-card px-5 py-10 text-sm text-muted">
            Loading…
          </p>
        ) : reviews.length === 0 ? (
          <p className="rounded-xl border border-line bg-card px-5 py-10 text-sm text-muted">
            You have not submitted any reviews yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-line bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{review.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <StarRatingDisplay rating={review.rating} className="mt-2" />
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {review.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
