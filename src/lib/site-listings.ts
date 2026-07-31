import type { FilterKey, SiteListing } from "@/config/landing";

export type SortValue = "recommended" | "price" | "traffic" | "dr" | "da";

export function filterAndSortSites(
  filter: FilterKey,
  sort: SortValue,
  source: SiteListing[],
): SiteListing[] {
  let next = source.filter((site) => {
    if (filter === "all") return true;
    if (filter === "budget") return site.guest < 50;
    if (filter === "authority") return site.dr >= 40 && site.dr <= 60;
    if (filter === "traffic") return site.traffic >= 10000;
    if (filter === "India") return site.country === "India";
    if (filter === "highDa") return site.da >= 50;
    return site.niche === filter;
  });

  if (sort === "price") next = [...next].sort((a, b) => a.guest - b.guest);
  if (sort === "traffic") next = [...next].sort((a, b) => b.traffic - a.traffic);
  if (sort === "dr") next = [...next].sort((a, b) => b.dr - a.dr);
  if (sort === "da") next = [...next].sort((a, b) => b.da - a.da);
  return next;
}
