import type { Locale } from "@/i18n/config";

export const en = {
  common: {
    signIn: "Sign in",
    getCustomList: "Get custom list",
    skipToMarketplace: "Skip to marketplace",
    loading: "Loading page",
    toggleNav: "Toggle navigation",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    language: "Language",
    chooseLanguage: "Choose language",
  },
  nav: {
    services: "Services",
    agencies: "For Agencies",
    howItWorks: "How it works",
    pricing: "Pricing",
    resources: "Resources",
    marketplace: "Marketplace",
    chooseMarket: "Choose a market",
  },
  marketplaceCountries: {
    IN: { name: "India", description: "Verified .in placements" },
    US: { name: "United States", description: "US authority sites" },
    ES: { name: "Spain", description: "Spanish & LatAm reach" },
    GB: { name: "United Kingdom", description: "UK niche publishers" },
    DE: { name: "Germany", description: "DACH market sites" },
    AU: { name: "Australia", description: "ANZ guest posts" },
    CA: { name: "Canada", description: "Canadian inventory" },
    AE: { name: "UAE", description: "Gulf region placements" },
  },
  hero: {
    breadcrumbHome: "Home",
    breadcrumbGuest: "Guest post sites",
    breadcrumbIndia: "India",
    eyebrow: "India placement marketplace",
    titleLine1: "Indian guest posts.",
    titleLine2: "Verified, not guessed.",
    subtitle:
      "Find publisher-ready Indian websites with real organic traffic, transparent pricing, and turnaround times you can plan around.",
    ctaBrowse: "Browse verified sites",
    ctaShortlist: "Build my shortlist",
    trust: {
      noFees: "No hidden fees",
      replacement: "7-day replacement",
      reports: "Live URL reports",
    },
    campaignBuilder: "Campaign builder",
    indiaAuthority: "India authority links",
    liveInventory: "Live inventory",
    searchPlaceholder: "Search by niche, domain or metric...",
    sitesSelected: "2 sites selected",
    estimatedTotal: "Estimated total",
    continue: "Continue →",
    trafficChecked: "Traffic checked",
    trafficDate: "14 Jul 2026",
    stats: {
      websites: "Indian websites",
      niches: "Niches covered",
      tat: "Days avg. TAT",
      dofollow: "Dofollow available",
    },
    qualityTitle: "Quality-checked inventory",
    qualitySub: "Metrics shown are demo data",
  },
  marketplace: {
    kicker: "Smart discovery",
    title: "Shortlist the right sites in minutes",
    description:
      "Filter by the metrics that matter, compare options, and build one campaign list.",
    badge: "Prototype · Demo inventory",
    verified: "{count} verified placements",
    updated: "updated for this demo",
    sortBy: "Sort by",
    sort: {
      recommended: "Recommended",
      price: "Price: Low to high",
      traffic: "Highest traffic",
      dr: "Highest DR",
    },
    filters: {
      all: { label: "All sites", sub: "Full inventory" },
      budget: { label: "Under $50", sub: "Budget picks" },
      authority: { label: "DR 40–60", sub: "Authority sites" },
      traffic: { label: "Traffic 10K+", sub: "High traffic" },
      Technology: { label: "Technology", sub: "Tech niche" },
      Business: { label: "Business", sub: "Business niche" },
      admin: { label: "Admin sites", sub: "Direct control" },
    },
    columns: {
      website: "Website",
      niche: "Niche",
      dr: "DR",
      traffic: "Organic traffic",
      indiaShare: "India share",
      guestPost: "Guest post",
      tat: "TAT",
      action: "Action",
    },
    addSite: "Add site",
    selected: "Selected",
    viewMore: "View more placements ↓",
    moreLoaded: "More demo inventory loaded",
  },
  benefits: {
    kicker: "Built for confident buying",
    title: "Every signal you need. Nothing hidden.",
    items: {
      inventory: {
        title: "Direct & trusted inventory",
        description:
          "Admin-controlled and vetted partner websites with clear placement histories.",
      },
      processing: {
        title: "Fast order processing",
        description: "Clear turnaround times and a streamlined campaign approval flow.",
      },
      replacement: {
        title: "Replacement assurance",
        description: "A defined replacement policy if an eligible link is removed.",
      },
      report: {
        title: "One live report",
        description: "URLs, anchor text, target pages, costs, and status in one place.",
      },
    },
  },
  agency: {
    kicker: "Linkerbuddy for agencies",
    title: "Scale delivery without scaling the chaos.",
    description:
      "One reliable placement partner for recurring campaigns, transparent costs, and client-ready reporting.",
    perks: {
      pricing: "Reseller-friendly bulk pricing",
      manager: "Dedicated campaign manager",
      reports: "White-label placement reports",
      inventory: "Private inventory on request",
    },
    cta: "Explore agency pricing →",
    overview: "Campaign overview",
    month: "July 2026",
    metrics: {
      live: "Live placements",
      tat: "Avg. TAT",
      ontime: "On-time",
    },
    toast: "Agency pricing request received",
  },
  steps: {
    kicker: "A clearer workflow",
    title: "From brief to live link in four steps",
    items: {
      "01": {
        title: "Filter or share your brief",
        description:
          "Choose placements yourself or tell us your niche, traffic and budget targets.",
      },
      "02": {
        title: "Approve your shortlist",
        description: "Review metrics, pricing, content rules, and turnaround expectations.",
      },
      "03": {
        title: "We publish",
        description:
          "Our team coordinates content and publishing with every selected website.",
      },
      "04": {
        title: "Receive your report",
        description: "Get the live URL and campaign details in one client-ready report.",
      },
    },
  },
  faq: {
    kicker: "Common questions",
    title: "Know exactly what you're ordering.",
    description: "Clear answers before you commit a campaign budget.",
    contact: "Still unsure? Talk to our team →",
    items: {
      verified: {
        q: "How are websites and traffic verified?",
        a: "Inventory is reviewed for organic visibility, traffic trend, editorial quality, outbound-link patterns, and publishing history. The final production site should connect these values to your live verification process.",
      },
      dofollow: {
        q: "Are the links permanent and dofollow?",
        a: "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
      },
      niches: {
        q: "Can I order casino, crypto or CBD placements?",
        a: "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
      },
      discounts: {
        q: "Do you provide content and bulk discounts?",
        a: "This prototype demonstrates where policy details and buying objections will be answered clearly before checkout.",
      },
    },
  },
  cta: {
    kicker: "Free custom shortlist",
    title: "Tell us what a perfect placement looks like.",
    description:
      "Share your niche, traffic target, and budget. We'll prepare a campaign-ready list.",
    niche: "Target niche",
    budget: "Budget per site",
    email: "Work email",
    emailPlaceholder: "you@agency.com",
    submit: "Build my shortlist →",
    toast: "Shortlist request received",
  },
  footer: {
    blurb:
      "Guest posts, niche edits, and placement campaigns built for agencies, resellers, and ambitious brands.",
    marketplace: "Marketplace",
    company: "Company",
    legal: "Legal",
    indiaSites: "India sites",
    adminSites: "Admin sites",
    linkInsertions: "Link insertions",
    howItWorks: "How it works",
    faqs: "FAQs",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    replacement: "Replacement policy",
    legalLine: "Privacy · Terms · Replacement policy",
    copyright: "Prototype for review.",
  },
  shortlist: {
    selectedOne: "{count} site selected",
    selectedMany: "{count} sites selected",
    estimated: "Estimated guest post total: ${total}",
    clear: "Clear",
    review: "Review shortlist →",
    ready: "Shortlist ready for review",
  },
  toast: {
    signInSoon: "Sign-in flow coming soon",
    marketplaceSelected: "{name} marketplace selected",
  },
  search: {
    title: "Search placements",
    close: "Close search",
    hint: "Type a domain, niche, DR, or price to find placements.",
    searching: "Searching inventory…",
    empty: "No placements match “{query}”.",
    openSearch: "Open placement search",
  },
  contact: {
    open: "Open contact options",
    close: "Close contact options",
    menu: "Contact options",
    email: "Email",
    whatsapp: "WhatsApp",
    phone: "Call",
  },
  pricing: {
    title: "Pricing",
    subtitle:
      "Choose a plan that matches your placement volume. Upgrade anytime as campaigns grow.",
    month: "month",
    cta: "Get started",
    noCard: "No credit card required",
    compare: "View plans comparison",
    plans: {
      startup: {
        name: "Startup",
        description: "Perfect for small teams and startups looking to get started with placements.",
        features: {
          users: "Up to 5 team seats",
          pages: "Up to 25 placements / month",
          domains: "India marketplace access",
          support: "Email support",
        },
      },
      growth: {
        name: "Growth",
        description: "Ideal for growing agencies that need more volume, reporting, and speed.",
        features: {
          users: "Up to 15 team seats",
          pages: "Up to 80 placements / month",
          domains: "Priority turnaround",
          support: "Live URL reports",
        },
      },
      enterprise: {
        name: "Enterprise",
        description: "Advanced tools for large organizations running multi-market campaigns.",
        features: {
          users: "Unlimited team seats",
          pages: "Custom placement volume",
          domains: "Private inventory options",
          support: "Dedicated campaign manager",
        },
      },
    },
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? DeepStringify<U>[]
      : T[K] extends object
        ? DeepStringify<T[K]>
        : T[K];
};

export type Dictionary = DeepStringify<typeof en>;
export type Messages = Dictionary;
