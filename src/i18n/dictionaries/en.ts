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
    eyebrow: "Verified placement marketplace",
    title: "Guest posts in {country}",
    subtitle:
      "Find publisher-ready websites in World with real organic traffic, transparent pricing, and turnaround times you can plan around.",
    rotating: {
      world: "World",
      usa: "USA",
      india: "India",
      spain: "Spain",
      uk: "UK",
      germany: "Germany",
      australia: "Australia",
      canada: "Canada",
      uae: "UAE",
    },
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
      websites: "Verified websites",
      niches: "Traffic countries",
      tat: "Publish TAT",
      dofollow: "Max dofollow links",
      loading: "Loading inventory stats",
      error: "Couldn’t load inventory stats.",
      retry: "Retry",
    },
    qualityTitle: "Quality-checked inventory",
    qualitySub: "Live Moz & Ahrefs metrics",
  },
  seo: {
    siteName: "Linkerbuddy",
    titleTemplate: "{title} | Linkerbuddy",
    pages: {
      home: {
        title: "India Guest Post Sites",
        description:
          "Browse verified Indian guest post and link insertion placements with transparent pricing and fast turnaround.",
      },
      inventory: {
        title: "Full inventory",
        description:
          "Browse the full guest post inventory with Moz DA, Ahrefs DR, traffic, pricing, and instant TAT.",
      },
      about: {
        title: "About",
        description: "Learn how Linkerbuddy verifies placements and helps teams buy guest posts with confidence.",
      },
      pricing: {
        title: "Pricing",
        description: "Simple placement plans for startups, agencies, and enterprise SEO teams.",
      },
      blog: {
        title: "Blog",
        description: "Guides and updates on guest posts, link building, and marketplace buying.",
      },
      contact: {
        title: "Contact",
        description: "Talk to the Linkerbuddy team about custom lists, bulk campaigns, and marketplace access.",
      },
    },
  },
  marketplace: {
    kicker: "Smart discovery",
    title: "Shortlist the right sites in minutes",
    description:
      "Filter by the metrics that matter, compare options, and build one campaign list.",
    badge: "Live inventory · {count} sites",
    verified: "{count} verified placements",
    verifiedLoading: "Loading inventory…",
    verifiedError: "Couldn’t load inventory.",
    retry: "Retry",
    updated: "metrics from Moz & Ahrefs",
    sortBy: "Sort by",
    filterGroup: "Marketplace filters",
    emptyTitle: "No sites match these filters",
    emptyDescription: "Try removing a filter or reset to browse the full inventory.",
    clearFilters: "Clear filters",
    sort: {
      recommended: "Recommended",
      price: "Price: Low to high",
      traffic: "Highest traffic",
      dr: "Highest DR",
      da: "Highest DA",
    },
    filters: {
      all: { label: "All sites", sub: "Full inventory" },
      budget: { label: "Under $50", sub: "Budget picks" },
      authority: { label: "DR 40–60", sub: "Authority sites" },
      traffic: { label: "Traffic 10K+", sub: "High traffic" },
      India: { label: "India", sub: "India traffic" },
      General: { label: "General", sub: "General niche" },
      highDa: { label: "DA 50+", sub: "High authority" },
    },
    columns: {
      website: "Website",
      niche: "Niche",
      da: "DA",
      dr: "DR",
      traffic: "Organic traffic",
      country: "Country",
      guestPost: "Guest post",
      tat: "TAT",
      action: "Action",
    },
    addSite: "Add site",
    selected: "Selected",
    viewMore: "View full inventory →",
    moreLoaded: "More inventory loaded",
  },
  inventory: {
    kicker: "Full catalog",
    title: "Browse every verified placement",
    description:
      "Load more sites as you go. Open any row for full metrics, pricing, and publishing details.",
    backHome: "Back to homepage",
    showing: "Showing {shown} of {total}",
    loadMore: "Load {count} more sites",
    loading: "Loading placements…",
    allLoaded: "All {total} sites loaded",
    viewDetails: "View details for {domain}",
    modal: {
      kicker: "Placement details",
      close: "Close details",
      da: "Moz DA",
      dr: "Ahrefs DR",
      traffic: "Traffic",
      tat: "Publish TAT",
      guestPost: "Guest post",
      linkInsert: "Link insertion",
      details: "Publishing details",
      owner: "Owner",
      trend: "Trend",
      dofollow: "Max dofollow",
      niche: "Niche",
      visit: "Visit site",
    },
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
  reviews: {
    kicker: "Customer reviews",
    title: "Customer Reviews",
    description:
      "Real feedback from completed placement orders — ratings and notes from customers who finished their campaigns.",
  },
  cta: {
    kicker: "AI-powered custom shortlist",
    title: "Tell us what a perfect placement looks like.",
    description:
      "Share your niche, traffic target, and budget. Our AI analyzes inventory and builds a campaign-ready shortlist in seconds.",
    niche: "Target niche",
    budget: "Budget per site",
    email: "Work email",
    emailPlaceholder: "you@agency.com",
    submit: "Build my AI shortlist →",
    toast: "AI shortlist analysis started",
    modal: {
      kicker: "AI shortlist",
      title: "Your campaign-ready picks",
      loadingTitle: "Analyzing your brief…",
      loadingHint: "Matching inventory to niche, budget, and authority signals.",
      stepInventory: "Scanning verified inventory…",
      stepAnalyze: "Scoring niche and budget fit…",
      stepRank: "Ranking campaign-ready sites…",
      tips: "Strategy tips",
      picks: "{count} recommended placements",
      fit: "fit",
      close: "Close shortlist",
      done: "Looks good",
      retry: "Try again",
      errorTitle: "Couldn’t build your shortlist",
      error: "Something went wrong while analyzing your brief. Please try again.",
      empty: "No matching placements found for this brief yet.",
    },
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
    estimated: "Estimated total: ${total}",
    clear: "Clear",
    review: "Review shortlist →",
    ready: "Shortlist ready for review",
  },
  cart: {
    title: "Your cart",
    close: "Close cart",
    empty: "No sites selected yet. Add sites from the marketplace.",
    itemCount: "{count} item(s)",
    remove: "Remove item",
    guest: "Guest post",
    insert: "Link insert",
    each: "each",
    decreaseQty: "Decrease quantity",
    increaseQty: "Increase quantity",
    subtotal: "Subtotal",
    clear: "Clear cart",
    checkout: "Go to checkout →",
  },
  checkout: {
    title: "Checkout",
    subtitle: "Confirm billing details and pay securely with Stripe.",
    empty: "Your cart is empty.",
    browse: "Browse marketplace",
    loginRequired: "Please sign in to complete checkout.",
    signIn: "Sign in",
    billing: "Billing details",
    orderSummary: "Order summary",
    pay: "Pay now",
    processing: "Processing…",
    saveProfile: "Save details to my profile",
    successTitle: "Order placed successfully",
    successSubtitle: "Thank you — your order is pending review.",
    orderNumber: "Order number",
    backHome: "Back to home",
    viewOrders: "View my orders",
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
    telegram: "Telegram",
    phone: "Call",
  },
  scrollToTop: {
    label: "Scroll to top",
  },
  preloader: {
    label: "Loading Linkerbuddy",
    loading: "Preparing placements…",
  },
  pricing: {
    title: "Pricing",
    subtitle:
      "Choose the authority level and placement volume that matches your SEO strategy.",
    month: "month",
    cta: "Get started",
    noCard: "No credit card required",
    compare: "View Detailed Metric Comparison",
    plans: {
      startup: {
        name: "Standard Authority",
        description: "For small teams launching their first outreach campaigns.",
        cta: "Order Placement",
        features: {
          dr: "Minimum DR 20-30+ (Ahrefs)",
          content: "Client supplies content",
          placement: "1 Placement per purchase",
          indexation: "Guaranteed indexation",
        },
      },
      growth: {
        name: "Growth Authority",
        description:
          "Ideal for growing agencies that require more link juice and authority.",
        cta: "Order Bundle",
        features: {
          dr: "Minimum DR 40-50+ (Ahrefs)",
          content: "Professional content included (800+ words)",
          placements: "Up to 3 Placements bundle",
          turnaround: "Priority turnaround (7 days)",
        },
      },
      enterprise: {
        name: "Enterprise Link Building",
        description: "Scalable outreach solutions for high-volume SEO requirements.",
        cta: "Contact for Custom Plan",
        features: {
          dr: "Minimum DR 60+ (Premium Sites)",
          campaigns: "Multi-link campaigns",
          content: "Turnkey content & submission",
          manager: "Dedicated Account Manager",
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
