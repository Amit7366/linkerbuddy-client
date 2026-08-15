"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { getMarketplaceFacets } from "@/lib/api/marketplace";
import {
  EMPTY_CUSTOM_FILTER,
  type CustomMarketplaceFilter,
} from "@/lib/marketplace-filters";
import { useTranslations } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomMarketplaceFilterModalProps {
  open: boolean;
  value: CustomMarketplaceFilter;
  onClose: () => void;
  onApply: (filter: CustomMarketplaceFilter) => void;
  onReset: () => void;
}

const inputClass =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand";

function matchFacet(options: string[], value: string) {
  if (!value) return "";
  return options.find((item) => item.toLowerCase() === value.toLowerCase()) ?? value;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-[10px] font-bold tracking-[0.5px] text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}

function NumberPair({
  minId,
  maxId,
  min,
  max,
  minPlaceholder,
  maxPlaceholder,
  maxValue,
  onMin,
  onMax,
}: {
  minId: string;
  maxId: string;
  min: string;
  max: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  maxValue?: number;
  onMin: (value: string) => void;
  onMax: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        id={minId}
        type="number"
        inputMode="numeric"
        min={0}
        max={maxValue}
        value={min}
        placeholder={minPlaceholder}
        onChange={(event) => onMin(event.target.value)}
        className={inputClass}
      />
      <input
        id={maxId}
        type="number"
        inputMode="numeric"
        min={0}
        max={maxValue}
        value={max}
        placeholder={maxPlaceholder}
        onChange={(event) => onMax(event.target.value)}
        className={inputClass}
      />
    </div>
  );
}

function CustomFilterPanel({
  value,
  onClose,
  onApply,
  onReset,
}: Omit<CustomMarketplaceFilterModalProps, "open">) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const titleId = useId();
  const [draft, setDraft] = useState<CustomMarketplaceFilter>(value);
  const [countries, setCountries] = useState<string[]>([]);
  const [niches, setNiches] = useState<string[]>([]);
  const [facetsError, setFacetsError] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setFacetsError(false);
    void getMarketplaceFacets()
      .then((facets) => {
        if (cancelled) return;
        setCountries(facets.countries);
        setNiches(facets.niches);
        setDraft((current) => ({
          ...current,
          country: matchFacet(facets.countries, current.country),
          niche: matchFacet(facets.niches, current.niche),
        }));
      })
      .catch(() => {
        if (!cancelled) setFacetsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof CustomMarketplaceFilter>(
    key: K,
    next: CustomMarketplaceFilter[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onApply(draft);
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 tablet:items-center tablet:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.button
        type="button"
        aria-label={t("marketplace.custom.close")}
        className="absolute inset-0 border-0 bg-[#071b3d]/55 backdrop-blur-xl dark:bg-[#02060f]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[22px] border border-line bg-card p-5 shadow-[0_30px_80px_#071b3d40] tablet:rounded-[22px] tablet:p-6 dark:shadow-[0_30px_80px_#00000080]"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[1.2px] text-brand uppercase">
              {t("marketplace.custom.kicker")}
            </p>
            <h2 id={titleId} className="mt-1 flex items-center gap-2 text-[20px] font-extrabold text-ink">
              <SlidersHorizontal className="size-5 text-brand" aria-hidden />
              {t("marketplace.custom.title")}
            </h2>
            <p className="mt-1 text-[12px] text-muted">{t("marketplace.custom.description")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("marketplace.custom.close")}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-sky"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="grid gap-4 tablet:grid-cols-2">
          <Field label={t("marketplace.custom.country")} htmlFor="custom-filter-country">
            <select
              id="custom-filter-country"
              value={draft.country}
              onChange={(event) => update("country", event.target.value)}
              className={cn(inputClass, "appearance-none")}
            >
              <option value="">{t("marketplace.custom.anyCountry")}</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {draft.country &&
              !countries.some((item) => item.toLowerCase() === draft.country.toLowerCase()) ? (
                <option value={draft.country}>{draft.country}</option>
              ) : null}
            </select>
          </Field>

          <Field label={t("marketplace.custom.niche")} htmlFor="custom-filter-niche">
            <select
              id="custom-filter-niche"
              value={draft.niche}
              onChange={(event) => update("niche", event.target.value)}
              className={cn(inputClass, "appearance-none")}
            >
              <option value="">{t("marketplace.custom.anyNiche")}</option>
              {niches.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {draft.niche &&
              !niches.some((item) => item.toLowerCase() === draft.niche.toLowerCase()) ? (
                <option value={draft.niche}>{draft.niche}</option>
              ) : null}
            </select>
          </Field>
        </div>

        {facetsError ? (
          <p className="mt-2 text-[11px] text-muted">{t("marketplace.custom.facetsError")}</p>
        ) : null}

        <div className="mt-4 grid gap-4 tablet:grid-cols-2">
          <Field label={t("marketplace.custom.dr")}>
            <NumberPair
              minId="custom-filter-dr-min"
              maxId="custom-filter-dr-max"
              min={draft.drMin}
              max={draft.drMax}
              minPlaceholder={t("marketplace.custom.min")}
              maxPlaceholder={t("marketplace.custom.max")}
              maxValue={100}
              onMin={(next) => update("drMin", next)}
              onMax={(next) => update("drMax", next)}
            />
          </Field>
          <Field label={t("marketplace.custom.da")}>
            <NumberPair
              minId="custom-filter-da-min"
              maxId="custom-filter-da-max"
              min={draft.daMin}
              max={draft.daMax}
              minPlaceholder={t("marketplace.custom.min")}
              maxPlaceholder={t("marketplace.custom.max")}
              maxValue={100}
              onMin={(next) => update("daMin", next)}
              onMax={(next) => update("daMax", next)}
            />
          </Field>
          <Field label={t("marketplace.custom.traffic")}>
            <NumberPair
              minId="custom-filter-traffic-min"
              maxId="custom-filter-traffic-max"
              min={draft.trafficMin}
              max={draft.trafficMax}
              minPlaceholder={t("marketplace.custom.min")}
              maxPlaceholder={t("marketplace.custom.max")}
              onMin={(next) => update("trafficMin", next)}
              onMax={(next) => update("trafficMax", next)}
            />
          </Field>
          <Field label={t("marketplace.custom.price")}>
            <NumberPair
              minId="custom-filter-price-min"
              maxId="custom-filter-price-max"
              min={draft.priceMin}
              max={draft.priceMax}
              minPlaceholder={t("marketplace.custom.min")}
              maxPlaceholder={t("marketplace.custom.max")}
              onMin={(next) => update("priceMin", next)}
              onMax={(next) => update("priceMax", next)}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 tablet:flex-row tablet:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setDraft(EMPTY_CUSTOM_FILTER);
              onReset();
              onClose();
            }}
          >
            {t("marketplace.custom.reset")}
          </Button>
          <Button type="submit">{t("marketplace.custom.apply")}</Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export function CustomMarketplaceFilterModal({
  open,
  value,
  onClose,
  onApply,
  onReset,
}: CustomMarketplaceFilterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <CustomFilterPanel
          value={value}
          onClose={onClose}
          onApply={onApply}
          onReset={onReset}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
