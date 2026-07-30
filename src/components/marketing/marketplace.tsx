"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { useShortlist } from "@/providers/shortlist-provider";
import { useToast } from "@/components/ui/toast";
import {
  MARKETPLACE_FILTERS,
  SITE_LISTINGS,
  SORT_OPTIONS,
  formatTraffic,
  type FilterKey,
} from "@/config/landing";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

export function Marketplace() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("recommended");
  const { selectedIds, toggle } = useShortlist();
  const { showToast } = useToast();
  const t = useTranslations();

  const sites = useMemo(() => {
    let next = SITE_LISTINGS.filter((site) => {
      if (filter === "all") return true;
      if (filter === "budget") return site.guest < 50;
      if (filter === "authority") return site.dr >= 40 && site.dr <= 60;
      if (filter === "traffic") return site.traffic >= 10000;
      if (filter === "admin") return site.owner === "Admin";
      return site.niche === filter;
    });

    if (sort === "price") next = [...next].sort((a, b) => a.guest - b.guest);
    if (sort === "traffic") next = [...next].sort((a, b) => b.traffic - a.traffic);
    if (sort === "dr") next = [...next].sort((a, b) => b.dr - a.dr);
    return next;
  }, [filter, sort]);

  return (
    <section id="marketplace" className="lb-section" aria-labelledby="marketplace-heading">
      <Container>
        <Reveal>
          <SectionHeading
            align="split"
            id="marketplace-heading"
            kicker={t("marketplace.kicker")}
            title={t("marketplace.title")}
            description={t("marketplace.description")}
            badge={t("marketplace.badge")}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="mt-[29px] mb-[23px] flex gap-2.5 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:grid tablet:grid-cols-7 tablet:overflow-visible tablet:pr-0"
            role="group"
            aria-label="Quick site filters"
          >
            {MARKETPLACE_FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "flex min-w-[132px] cursor-pointer items-center gap-2.5 rounded-[10px] border border-line bg-card px-2.5 py-3 text-left hover:border-[#72a9f8] hover:bg-sky hover:shadow-[0_5px_18px_#2067d317] tablet:min-w-0",
                  filter === item.key && "border-[#72a9f8] bg-sky shadow-[0_5px_18px_#2067d317]",
                )}
              >
                <span
                  className={cn(
                    "grid size-[29px] place-items-center rounded-lg bg-sky font-extrabold text-brand",
                    filter === item.key && "bg-brand text-white",
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex flex-col gap-0.5">
                  <b className="text-[10px] text-ink">{t(`marketplace.filters.${item.key}.label`)}</b>
                  <small className="text-[8px] text-muted">
                    {t(`marketplace.filters.${item.key}.sub`)}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mb-3 flex flex-col items-start justify-between gap-2.5 text-[11px] tablet:flex-row tablet:items-center">
          <span className="text-muted">
            <b className="text-ink">
              {t("marketplace.verified", { count: sites.length })}
            </b>{" "}
            · {t("marketplace.updated")}
          </span>
          <label className="flex items-center gap-2 text-muted">
            {t("marketplace.sortBy")}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-lg border border-line bg-card px-3 py-2 text-[11px] text-ink"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`marketplace.sort.${option.value}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Reveal delay={0.12}>
          <div
            className="overflow-hidden rounded-xl border-0 shadow-none tablet:border tablet:border-line tablet:bg-card tablet:shadow-[var(--shadow-table)]"
            role="table"
            aria-label="Guest post inventory"
          >
            <div
              className="hidden min-h-[42px] grid-cols-[1.65fr_0.8fr_0.35fr_0.8fr_0.7fr_0.65fr_0.58fr_0.65fr] items-center bg-navy px-[15px] text-[9px] tracking-[0.4px] text-[#d8e3f2] uppercase tablet:grid"
              role="row"
            >
              <span>{t("marketplace.columns.website")}</span>
              <span>{t("marketplace.columns.niche")}</span>
              <span>{t("marketplace.columns.dr")}</span>
              <span>{t("marketplace.columns.traffic")}</span>
              <span>{t("marketplace.columns.indiaShare")}</span>
              <span>{t("marketplace.columns.guestPost")}</span>
              <span>{t("marketplace.columns.tat")}</span>
              <span>{t("marketplace.columns.action")}</span>
            </div>

            {sites.map((site) => {
              const selected = selectedIds.includes(site.id);
              return (
                <div
                  key={site.id}
                  role="row"
                  className={cn(
                    "mb-2.5 grid grid-cols-3 gap-3.5 rounded-xl border border-line bg-card p-[15px] text-[11px] text-ink tablet:mb-0 tablet:min-h-[65px] tablet:grid-cols-[1.65fr_0.8fr_0.35fr_0.8fr_0.7fr_0.65fr_0.58fr_0.65fr] tablet:items-center tablet:gap-0 tablet:rounded-none tablet:border-0 tablet:border-t tablet:border-line tablet:px-[15px] tablet:py-0 tablet:hover:bg-sky",
                    selected && "bg-sky dark:bg-[#15233a]",
                  )}
                >
                  <div className="col-span-3 flex items-center gap-2.5 tablet:col-span-1">
                    <button
                      type="button"
                      aria-label={`Select ${site.domain}`}
                      aria-pressed={selected}
                      onClick={() => toggle(site.id)}
                      className={cn(
                        "grid size-[25px] place-items-center rounded-[7px] border border-line bg-card text-sm font-bold text-brand",
                        selected && "border-brand bg-brand text-white",
                      )}
                    >
                      {selected ? "✓" : "+"}
                    </button>
                    <div className="flex flex-col gap-1">
                      <b className="text-[11px] text-ink">{site.domain}</b>
                      <small className="text-[8px] text-muted">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5",
                            site.owner === "Admin"
                              ? "bg-[#daf5eb] text-[#07805d] dark:bg-[#0f3d32] dark:text-[#34d399]"
                              : "bg-[#fff0d8] text-[#a86500] dark:bg-[#3d2e0f] dark:text-[#fbbf24]",
                          )}
                        >
                          {site.owner}
                        </span>
                        {" · "}
                        {site.trend} ↗
                      </small>
                    </div>
                  </div>

                  <span
                    data-label="Niche"
                    className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
                  >
                    {site.niche}
                  </span>
                  <span
                    data-label="DR"
                    className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
                  >
                    {site.dr}
                  </span>
                  <strong
                    data-label="Traffic"
                    className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
                  >
                    {formatTraffic(site.traffic)}
                    <small className="mt-0.5 block text-[8px] font-normal text-green">↗ 6.4%</small>
                  </strong>
                  <span
                    data-label="India share"
                    className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
                  >
                    🇮🇳 {site.countryShare}%
                  </span>
                  <strong
                    data-label="Guest post"
                    className="text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:before:hidden"
                  >
                    ${site.guest}{" "}
                    <small className="text-[8px] font-normal text-muted">/ post</small>
                  </strong>
                  <span
                    data-label="TAT"
                    className="hidden text-ink before:mb-1 before:block before:text-[8px] before:font-normal before:text-muted before:uppercase before:content-[attr(data-label)] tablet:block tablet:before:hidden"
                  >
                    {site.tat}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(site.id)}
                    className={cn(
                      "col-span-3 cursor-pointer rounded-lg border border-[#9fc0f0] bg-[#eaf3ff] px-3 py-2 text-[9px] font-bold text-[#1268f3] hover:bg-[#1268f3] hover:text-white tablet:col-span-1 dark:border-[#2a4570] dark:bg-[#15233a] dark:text-[#7db4ff] dark:hover:border-brand dark:hover:bg-brand dark:hover:text-white",
                      selected &&
                        "border-[#1268f3] bg-[#1268f3] text-white hover:bg-[#075be2] dark:border-brand dark:bg-brand dark:text-white",
                    )}
                  >
                    {selected ? t("marketplace.selected") : t("marketplace.addSite")}
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Button
          variant="ghost"
          className="mx-auto mt-[22px] block border border-line px-4 py-2.5 text-[11px] font-bold text-ink shadow-none"
          onClick={() => showToast(t("marketplace.moreLoaded"))}
        >
          {t("marketplace.viewMore")}
        </Button>
      </Container>
    </section>
  );
}
