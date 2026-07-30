export type SiteListing = {
  id: number;
  domain: string;
  niche: string;
  dr: number;
  traffic: number;
  country: string;
  countryShare: number;
  guest: number;
  insert: number;
  tat: string;
  owner: "Admin" | "Partner";
  trend: "Rising" | "Stable";
};

export const SITE_LISTINGS: SiteListing[] = [
  {
    id: 1,
    domain: "TechVista.in",
    niche: "Technology",
    dr: 48,
    traffic: 18200,
    country: "India",
    countryShare: 89,
    guest: 45,
    insert: 35,
    tat: "2–3 days",
    owner: "Admin",
    trend: "Rising",
  },
  {
    id: 2,
    domain: "BusinessBeacon.in",
    niche: "Business",
    dr: 53,
    traffic: 22700,
    country: "India",
    countryShare: 91,
    guest: 50,
    insert: 40,
    tat: "2–3 days",
    owner: "Admin",
    trend: "Stable",
  },
  {
    id: 3,
    domain: "StartupPulse.in",
    niche: "Business",
    dr: 46,
    traffic: 15600,
    country: "India",
    countryShare: 88,
    guest: 45,
    insert: 35,
    tat: "1–2 days",
    owner: "Partner",
    trend: "Rising",
  },
  {
    id: 4,
    domain: "DailyWire24.com",
    niche: "News / Media",
    dr: 60,
    traffic: 32500,
    country: "India",
    countryShare: 92,
    guest: 60,
    insert: 50,
    tat: "3–4 days",
    owner: "Admin",
    trend: "Stable",
  },
  {
    id: 5,
    domain: "TravelTadka.com",
    niche: "Travel",
    dr: 44,
    traffic: 10400,
    country: "India",
    countryShare: 90,
    guest: 40,
    insert: 30,
    tat: "2–3 days",
    owner: "Partner",
    trend: "Rising",
  },
  {
    id: 6,
    domain: "FinanceOrbit.in",
    niche: "Finance",
    dr: 49,
    traffic: 19100,
    country: "India",
    countryShare: 87,
    guest: 55,
    insert: 45,
    tat: "2–3 days",
    owner: "Admin",
    trend: "Stable",
  },
  {
    id: 7,
    domain: "WellnessMint.in",
    niche: "Health",
    dr: 41,
    traffic: 8700,
    country: "India",
    countryShare: 93,
    guest: 40,
    insert: 30,
    tat: "2–3 days",
    owner: "Admin",
    trend: "Rising",
  },
  {
    id: 8,
    domain: "DigitalGyan.org",
    niche: "Technology",
    dr: 43,
    traffic: 12300,
    country: "India",
    countryShare: 86,
    guest: 40,
    insert: 30,
    tat: "1–2 days",
    owner: "Partner",
    trend: "Stable",
  },
];

export const MARKETPLACE_FILTERS = [
  { key: "all", icon: "✦", label: "All sites", sub: "Full inventory" },
  { key: "budget", icon: "$", label: "Under $50", sub: "Budget picks" },
  { key: "authority", icon: "◇", label: "DR 40–60", sub: "Authority sites" },
  { key: "traffic", icon: "↗", label: "Traffic 10K+", sub: "High traffic" },
  { key: "Technology", icon: "⌘", label: "Technology", sub: "Tech niche" },
  { key: "Business", icon: "▦", label: "Business", sub: "Business niche" },
  { key: "admin", icon: "✓", label: "Admin sites", sub: "Direct control" },
] as const;

export type FilterKey = (typeof MARKETPLACE_FILTERS)[number]["key"];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price", label: "Price: Low to high" },
  { value: "traffic", label: "Highest traffic" },
  { value: "dr", label: "Highest DR" },
] as const;

export const HERO_TRUST = [
  "No hidden fees",
  "7-day replacement",
  "Live URL reports",
] as const;

export const HERO_STATS = [
  { value: "250", suffix: "+", label: "Indian websites", countTo: 250, duration: 1.6 },
  { value: "25", suffix: "+", label: "Niches covered", countTo: 25, duration: 1.2 },
  { value: "1–3", suffix: "", label: "Days avg. TAT", countTo: null, duration: 0 },
  { value: "90", suffix: "%", label: "Dofollow available", countTo: 90, duration: 1.4 },
] as const;

export const BENEFITS = [
  {
    icon: "◉",
    title: "Direct & trusted inventory",
    description:
      "Admin-controlled and vetted partner websites with clear placement histories.",
  },
  {
    icon: "↯",
    title: "Fast order processing",
    description: "Clear turnaround times and a streamlined campaign approval flow.",
  },
  {
    icon: "♢",
    title: "Replacement assurance",
    description: "A defined replacement policy if an eligible link is removed.",
  },
  {
    icon: "▤",
    title: "One live report",
    description: "URLs, anchor text, target pages, costs, and status in one place.",
  },
] as const;

export const AGENCY_PERKS = [
  "Reseller-friendly bulk pricing",
  "Dedicated campaign manager",
  "White-label placement reports",
  "Private inventory on request",
] as const;

export const AGENCY_METRICS = [
  { label: "Live placements", value: "48" },
  { label: "Avg. TAT", value: "2.4d" },
  { label: "On-time", value: "96%" },
] as const;

export const AGENCY_CHART_BARS = [
  {
    height: 44,
    label: "Mon",
    value: "32",
    unit: "live",
    hint: "Monday — 32 placements went live across agency accounts.",
  },
  {
    height: 62,
    label: "Tue",
    value: "41",
    unit: "live",
    hint: "Tuesday — steady fulfillment with 41 published links.",
  },
  {
    height: 51,
    label: "Wed",
    value: "36",
    unit: "live",
    hint: "Wednesday — mid-week volume held at 36 live placements.",
  },
  {
    height: 78,
    label: "Thu",
    value: "52",
    unit: "live",
    hint: "Thursday — peak publishing day with 52 links delivered.",
  },
  {
    height: 70,
    label: "Fri",
    value: "47",
    unit: "live",
    hint: "Friday — 47 placements completed before weekend handoff.",
  },
  {
    height: 92,
    label: "Sat",
    value: "61",
    unit: "live",
    hint: "Saturday — highest output this week: 61 live URLs.",
  },
  {
    height: 83,
    label: "Sun",
    value: "55",
    unit: "live",
    hint: "Sunday — strong close with 55 placements reported.",
  },
] as const;

export const PROCESS_STEP_KEYS = ["01", "02", "03", "04"] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Filter or share your brief",
    description:
      "Choose placements yourself or tell us your niche, traffic and budget targets.",
  },
  {
    step: "02",
    title: "Approve your shortlist",
    description: "Review metrics, pricing, content rules, and turnaround expectations.",
  },
  {
    step: "03",
    title: "We publish",
    description: "Our team coordinates content and publishing with every selected website.",
  },
  {
    step: "04",
    title: "Receive your report",
    description: "Get the live URL and campaign details in one client-ready report.",
  },
] as const;

export const FAQ_KEYS = ["verified", "dofollow", "niches", "discounts"] as const;

export const FAQ_ITEMS = [
  {
    question: "How are websites and traffic verified?",
    answer:
      "Inventory is reviewed for organic visibility, traffic trend, editorial quality, outbound-link patterns, and publishing history. The final production site should connect these values to your live verification process.",
  },
  {
    question: "Are the links permanent and dofollow?",
    answer:
      "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
  },
  {
    question: "Can I order casino, crypto or CBD placements?",
    answer:
      "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
  },
  {
    question: "Do you provide content and bulk discounts?",
    answer:
      "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
  },
] as const;

export const CTA_NICHES = [
  "Technology",
  "Business",
  "Finance",
  "Travel",
  "Casino / iGaming",
] as const;

export const CTA_BUDGETS = ["$30–$50", "$50–$100", "$100+"] as const;

export const HERO_PREVIEW_ROWS = [
  {
    initials: "TV",
    domain: "TechVista.in",
    meta: "Technology · India 89%",
    dr: "48",
    traffic: "18.2K",
    price: "$45",
    featured: true,
    purple: false,
  },
  {
    initials: "BB",
    domain: "BusinessBeacon.in",
    meta: "Business · India 91%",
    dr: "53",
    traffic: "22.7K",
    price: "$50",
    featured: false,
    purple: true,
  },
] as const;

export function formatTraffic(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return String(value);
}

export function domainInitials(domain: string): string {
  return domain
    .replace(/\.(in|com|org|net)$/i, "")
    .split(/(?=[A-Z])|[-_.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
