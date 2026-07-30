"use client";

import { Button } from "@/components/ui/button";
import { useShortlist } from "@/providers/shortlist-provider";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "@/providers/locale-provider";

export function ShortlistBar() {
  const { count, total, clear } = useShortlist();
  const { showToast } = useToast();
  const t = useTranslations();

  if (count === 0) return null;

  return (
    <div
      className="fixed bottom-2.5 left-1/2 z-[60] flex w-[calc(100%-20px)] min-w-0 -translate-x-1/2 items-center gap-2 rounded-[14px] border border-white/15 bg-navy px-3 py-2.5 text-white shadow-[var(--shadow-shortlist)] tablet:bottom-[18px] tablet:w-auto tablet:min-w-[510px] tablet:gap-4 tablet:py-2.5 tablet:pr-3 tablet:pl-3.5"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-1 items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-[#2679f2] text-sm font-extrabold">
          {count}
        </span>
        <div className="flex flex-col">
          <b className="text-[10px] tablet:text-[11px]">
            {count === 1
              ? t("shortlist.selectedOne", { count })
              : t("shortlist.selectedMany", { count })}
          </b>
          <small className="mt-0.5 text-[8px] text-[#aebdd2]">
            {t("shortlist.estimated", { total })}
          </small>
        </div>
      </div>

      <button
        type="button"
        onClick={clear}
        className="hidden border-0 bg-transparent text-[10px] text-[#aab9cf] tablet:inline"
      >
        {t("shortlist.clear")}
      </button>

      <Button size="sm" onClick={() => showToast(t("shortlist.ready"))}>
        {t("shortlist.review")}
      </Button>
    </div>
  );
}
