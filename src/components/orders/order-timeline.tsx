"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { OrderStatus, OrderStatusEvent } from "@/types/order";
import { ORDER_FLOW_STEPS, statusLabel } from "@/lib/orders-ui";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: OrderStatus;
  events?: OrderStatusEvent[];
  compact?: boolean;
}

export function OrderTimeline({ status, events = [], compact }: OrderTimelineProps) {
  const isRejected = status === "REJECTED";
  const isFailed = status === "FAILED";
  const isCancelled = status === "CANCELLED";

  const steps =
    isRejected
      ? (["PENDING", "REJECTED"] as OrderStatus[])
      : isCancelled
        ? (["PENDING", "CANCELLED"] as OrderStatus[])
      : isFailed
        ? ([...ORDER_FLOW_STEPS.slice(0, -1), "FAILED"] as OrderStatus[])
        : ORDER_FLOW_STEPS;

  const currentIdx = steps.indexOf(status);

  return (
    <div className={cn("w-full", compact ? "py-2" : "py-4")}>
      <ol className="relative flex flex-col gap-0">
        {steps.map((step, index) => {
          const done = currentIdx > index || (status === "COMPLETE" && step === "COMPLETE");
          const current = step === status;
          const event = [...events].reverse().find((e) => e.toStatus === step);
          const failedTone =
            step === "FAILED" || step === "REJECTED" || step === "CANCELLED";

          return (
            <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
              {index < steps.length - 1 ? (
                <span
                  className={cn(
                    "absolute top-7 left-[15px] h-[calc(100%-16px)] w-0.5",
                    done ? "bg-[#1a3d2e]" : "bg-zinc-200",
                    failedTone && current ? "bg-red-400" : null,
                  )}
                />
              ) : null}
              <motion.span
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: current ? 1.05 : 1, opacity: 1 }}
                className={cn(
                  "relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold",
                  done || current
                    ? failedTone
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-[#1a3d2e] bg-[#1a3d2e] text-white"
                    : "border-zinc-200 bg-white text-zinc-400",
                )}
              >
                {failedTone && current ? (
                  <X className="size-3.5" />
                ) : done || (current && status === "COMPLETE") ? (
                  <Check className="size-3.5" />
                ) : (
                  index + 1
                )}
              </motion.span>
              <div className="min-w-0 pt-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    current || done ? "text-ink" : "text-zinc-400",
                    failedTone && current ? "text-red-600" : null,
                  )}
                >
                  {statusLabel(step)}
                  {current ? (
                    <span className="ml-2 text-[10px] font-bold tracking-wide text-[#3d9a6a] uppercase">
                      Current
                    </span>
                  ) : null}
                </p>
                {event?.note ? (
                  <p className="mt-0.5 text-xs text-muted">{event.note}</p>
                ) : null}
                {event?.createdAt ? (
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
