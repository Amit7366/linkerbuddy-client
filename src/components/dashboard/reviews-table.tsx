"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import {
  deleteAdminReview,
  listAdminReviews,
  updateAdminReview,
  updateReviewVisibility,
} from "@/lib/api/reviews";
import type { AdminReview } from "@/types/review";
import {
  StarRatingDisplay,
  StarRatingInput,
} from "@/components/account/star-rating";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewsTable() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editDescription, setEditDescription] = useState("");
  const [editShowOnHome, setEditShowOnHome] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminReviews({
        page,
        limit: PAGE_SIZE,
        q: search || undefined,
      });
      setReviews(data.reviews);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  function openEdit(review: AdminReview) {
    setEditing(review);
    setEditRating(review.rating);
    setEditDescription(review.description);
    setEditShowOnHome(review.showOnHome);
    setError(null);
  }

  function closeEdit() {
    setEditing(null);
    setSaving(false);
  }

  async function toggleVisibility(review: AdminReview) {
    const next = !review.showOnHome;
    setTogglingId(review.id);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, showOnHome: next } : r,
      ),
    );
    try {
      const updated = await updateReviewVisibility(review.id, next);
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      if (editing?.id === review.id) {
        setEditing(updated);
        setEditShowOnHome(updated.showOnHome);
      }
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, showOnHome: review.showOnHome } : r,
        ),
      );
      setError(
        err instanceof Error ? err.message : "Failed to update visibility",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (editRating < 1) {
      setError("Please select a star rating");
      return;
    }
    if (editDescription.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminReview(editing.id, {
        rating: editRating,
        description: editDescription.trim(),
        showOnHome: editShowOnHome,
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      closeEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(review: AdminReview) {
    if (
      !window.confirm(
        `Delete review from ${review.authorName} (${review.orderNumber})? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(review.id);
    setError(null);
    try {
      await deleteAdminReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      setTotal((t) => Math.max(0, t - 1));
      if (editing?.id === review.id) closeEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q.trim());
        }}
      >
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, order, or text"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm text-zinc-900 outline-none focus:border-zinc-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Search
        </button>
      </form>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {loading ? (
          <p className="px-5 py-10 text-sm text-zinc-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-zinc-500">
            No reviews found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Review</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Home</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-900">
                        {review.authorName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {review.authorEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-medium text-zinc-800">
                      {review.orderNumber}
                    </td>
                    <td className="px-5 py-4">
                      <StarRatingDisplay rating={review.rating} size="sm" />
                    </td>
                    <td className="max-w-[280px] px-5 py-4 text-zinc-600">
                      <p className="line-clamp-2">{review.description}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={review.showOnHome}
                        disabled={togglingId === review.id}
                        onClick={() => void toggleVisibility(review)}
                        className={cn(
                          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition",
                          review.showOnHome ? "bg-emerald-600" : "bg-zinc-300",
                          togglingId === review.id && "opacity-60",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 rounded-full bg-white shadow transition",
                            review.showOnHome
                              ? "translate-x-6"
                              : "translate-x-1",
                          )}
                        />
                        <span className="sr-only">
                          {review.showOnHome
                            ? "Show on home page"
                            : "Hide from home page"}
                        </span>
                      </button>
                      <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                        {review.showOnHome ? "On" : "Off"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(review)}
                          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                          aria-label="Edit review"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === review.id}
                          onClick={() => void handleDelete(review)}
                          className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          {total} review{total === 1 ? "" : "s"} · page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-review-title"
            className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="edit-review-title"
                  className="text-lg font-semibold text-zinc-900"
                >
                  Edit review
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {editing.authorName} · {editing.orderNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
              >
                Close
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={(e) => void handleSaveEdit(e)}>
              <StarRatingInput
                value={editRating}
                onChange={setEditRating}
                disabled={saving}
                size="md"
              />
              <div className="space-y-2">
                <label
                  htmlFor="edit-review-description"
                  className="text-sm font-semibold text-zinc-900"
                >
                  Description
                </label>
                <textarea
                  id="edit-review-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={saving}
                  rows={5}
                  maxLength={1000}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                />
                <p className="text-xs text-zinc-500">
                  {editDescription.trim().length}/1000 · min 20 characters
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={editShowOnHome}
                  onChange={(e) => setEditShowOnHome(e.target.checked)}
                  disabled={saving}
                  className="size-4 rounded border-zinc-300"
                />
                Show on home page
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
