"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
  label?: string;
}

export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  size = "lg",
  className,
  label = "Rating",
}: StarRatingInputProps) {
  const groupId = useId();
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";

  return (
    <div className={cn("space-y-2", className)}>
      <p id={groupId} className="text-sm font-semibold text-ink">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="flex items-center gap-1.5"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= active;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              disabled={disabled}
              onMouseEnter={() => !disabled && setHovered(star)}
              onFocus={() => !disabled && setHovered(star)}
              onBlur={() => setHovered(0)}
              onClick={() => onChange(star)}
              className={cn(
                "rounded-md p-0.5 transition disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              )}
            >
              <span className="relative inline-flex">
                <Star
                  className={cn(iconSize, "text-amber-200")}
                  strokeWidth={1.5}
                />
                <motion.span
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: filled ? 1 : 0,
                    scale: filled ? 1 : 0.65,
                  }}
                  transition={{ type: "spring", stiffness: 480, damping: 26 }}
                >
                  <Star
                    className={cn(iconSize, "fill-amber-400 text-amber-400")}
                    strokeWidth={1.5}
                  />
                </motion.span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRatingDisplay({
  rating,
  size = "md",
  className,
}: StarRatingDisplayProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-amber-200",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
