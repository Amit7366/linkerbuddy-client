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
    more: "More",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    blog: "Blog",
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
        title: "Guest Post Sites",
        description:
          "Browse verified guest post and link insertion placements with transparent pricing and fast turnaround.",
      },
      inventory: {
        title: "Full inventory",
        description:
          "Browse the full guest post inventory with Moz DA, Ahrefs DR, traffic, pricing, and instant TAT.",
      },
      about: {
        title: "About Linkerbuddy",
        description:
          "Links that move rankings. Real sites, targeted traffic, and outreach built for growth.",
      },
      pricing: {
        title: "Pricing",
        description:
          "Simple, transparent pricing for guest posts and link insertions — single orders, growth packs, and agency bulk.",
      },
      blog: {
        title: "Blog",
        description:
          "Guides on guest posts, niche edits, and link building — including when each strategy drives faster SEO results.",
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
    prevFilters: "Previous filters",
    nextFilters: "More filters",
    countryGroup: "Filter by country",
    allCountries: "All countries",
    emptyTitle: "No sites match these filters",
    emptyDescription: "Try removing a filter or reset to browse the full inventory.",
    clearFilters: "Clear filters",
    custom: {
      label: "Custom filter",
      sub: "DR, DA, traffic…",
      kicker: "Advanced search",
      title: "Filter by your metrics",
      description: "Type the ranges you want, then apply to see matching sites.",
      close: "Close custom filter",
      country: "Country",
      niche: "Niche",
      anyCountry: "Any country",
      anyNiche: "Any niche",
      dr: "DR",
      da: "DA",
      traffic: "Traffic",
      price: "Guest post price",
      min: "Min",
      max: "Max",
      apply: "Show results",
      reset: "Reset",
      facetsError: "Couldn’t load country and niche lists. You can still type metric ranges.",
    },
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
    title: "Everything You Need to Know Before You Get Backlinks",
    description: "Clear answers before you commit a campaign budget.",
    contact: "Still unsure? Talk to our team →",
    items: {
      safe: {
        q: "Are your backlinks safe? Will they cause a Google penalty?",
        a: "Yes, our backlinks are 100% safe. We strictly place links on real, publisher-ready websites with authentic organic search traffic and strong domain authority (DR/DA). We do not use low-quality Private Blog Networks (PBNs), automated link networks, or spam sites, ensuring your domain remains fully compliant with Google guidelines.",
      },
      turnaround: {
        q: "How long does it take to get backlinks live?",
        a: "Turnaround time depends on the placement type. Niche edits (link insertions into existing articles) typically go live within 24 to 48 hours. Sponsored guest posts usually take between 3 to 7 business days, depending on publisher content approvals and editorial review schedules.",
      },
      chooseSites: {
        q: "Can I choose which websites my links are placed on?",
        a: "Yes, absolutely! You have full control over site selection. You can browse our marketplace inventory or request a custom site shortlist based on your preferred metrics (DR/DA, target country, organic traffic, and niche). You approve the site before any placement is finalized.",
      },
      whiteLabel: {
        q: "Do you offer white-label link building for agencies?",
        a: "Yes, we provide fully white-label link building solutions for agencies and resellers. All our reporting dashboards and placement reports come unbranded or white-labeled so you can deliver live link reports directly to your clients.",
      },
      replacement: {
        q: "What happens if a link goes down?",
        a: "We offer a guaranteed 7-Day / 30-Day Replacement Policy. If an eligible backlink is removed, lost, or marked as nofollow by a publisher within the guarantee period, our team will re-engage the publisher or replace it on an equivalent authority website at zero extra cost.",
      },
      anchorText: {
        q: "What anchor text strategy do you use?",
        a: "We recommend maintaining a natural link profile by blending exact-match, partial-match, branded, and URL anchors. When negotiating via email, you provide your preferred anchor text and target URL, and our editorial team ensures the anchor fits contextually within the post.",
      },
      howMany: {
        q: "How many backlinks do I need to rank?",
        a: "The number of backlinks required depends on your industry niche, keyword difficulty, and current domain authority relative to top-ranking competitors. We can analyze your target pages during email negotiations and recommend an effective campaign size.",
      },
      niches: {
        q: "Do you work with any niche or industry?",
        a: "We cover almost all major niches, including Tech, Business, Finance, Lifestyle, Health, Travel, E-commerce, Real Estate, and more. For specialized or sensitive niches (e.g., iGaming, Crypto), please reach out directly via email so we can curate a custom publisher shortlist.",
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
    contactHeading: "Contact",
    company: "Company",
    services: "Services",
    home: "Home",
    about: "About Us",
    contact: "Contact",
    blog: "Blog",
    guestPosts: "Guest Posts",
    linkInsertions: "Link Insertions",
    nicheEdits: "Niche Edits",
    customCampaigns: "Custom Campaigns",
    privacy: "Privacy",
    terms: "Terms",
    replacement: "Replacement policy",
    copyright: "All rights reserved.",
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
    subtitle: "Confirm your billing details and place your order.",
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
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the perfect package for your link-building needs.",
    month: "month",
    cta: "Get started",
    noCard: "No credit card required",
    popular: "Popular",
    compare: "View terms & service requirements",
    rateCard: {
      title: "Direct Special Offer Rate Card",
      note: "Single Site / Website Specific",
      guest: "General Guest Post",
      guestPrice: "$50",
      grey: "Grey Niche (Crypto, Casino, CBD, Gambling)",
      greyPrice: "$100",
      insertion: "Link Insertion",
      insertionGeneral: "General: $50",
      insertionGrey: "Grey niche: $100",
      tat: "Turnaround Time",
      tatValue: "Instant (No delays or waiting)",
      sitesNote:
        "We have 50+ good quality websites — all website prices are the same for you.",
      dashboardCta: "Access all websites Dashboard",
    },
    plans: {
      single: {
        name: "Single Order",
        price: "$50",
        unit: "/ link",
        description: "General Niche Rate",
        cta: "Order Placement",
        features: {
          guest: "$50 General Guest Post",
          insertion: "$50 General Link Insertion",
          grey: "$100 Grey Niche (Casino/Crypto)",
          tat: "Instant Turnaround Time",
          links: "Max 2 Dofollow Links",
          quality: "Copyscape & Grammarly Pass",
        },
      },
      growth: {
        name: "Growth Pack",
        price: "$225",
        unit: "/ 5 links",
        description: "$45/link • Save $25",
        cta: "Order Bundle",
        features: {
          posts: "5 Guest Posts or Link Insertions",
          mix: "Mix General or Grey Niches ($450)",
          dr: "High DR 30 - DR 70+ Sites",
          tat: "Instant Publishing (TAT)",
          indexing: "Guaranteed Indexing",
          dashboard: "Full 50+ Site Dashboard Access",
        },
      },
      agency: {
        name: "Agency Bulk",
        price: "$400",
        unit: "/ 10 links",
        description: "$40/link • Save $100",
        cta: "Contact for Custom Plan",
        features: {
          posts: "10 Guest Posts or Link Insertions",
          mix: "Mix General or Grey Niches ($800)",
          traffic: "High Traffic Sites (up to 60K+)",
          tat: "Instant Publishing (TAT)",
          manager: "Dedicated Account Manager",
          shortlist: "Custom Shortlist Support",
        },
      },
    },
    terms: {
      title: "Terms & Service Requirements",
      quality:
        "Article Quality: Minimum 500 words. Must pass Copyscape and Grammarly.",
      links:
        "Allowed Links: Maximum of 2 do-follow links. Unique articles only. No hyperlinks without anchor text.",
      payment:
        "Payment Methods: PayPal Invoice, Payoneer, Cryptocurrency (Binance USDT).",
      guarantees:
        "Guarantees: Lifetime link status (Minimum 3 Years guarantee), Indexing guarantee & unlimited revisions.",
      sponsored: "No Sponsored Tag: Articles will NOT be marked with a sponsored tag.",
      prohibited: "Prohibited: Adult content & adult links are strictly not allowed.",
    },
  },
  aboutPage: {
    heroTitle: "About us",
    breadcrumb: "About us",
    introHeading: "About us",
    introLead: "Links That Move Rankings. Outreach Built for Growth.",
    getInTouch: "Get in touch",
    title: "About Linkerbuddy",
    subtitle: "Links That Move Rankings. Outreach Built for Growth.",
    tagline: "Links that move rankings.",
    intro1:
      "At Linkerbuddy, we connect ambitious brands, SEO agencies, and digital marketers with real, high-authority websites worldwide. We eliminate the middleman hassle and quality guesswork, helping you acquire high-impact link placements that drive organic traffic and push search engine rankings higher.",
    intro2:
      "Whether you need targeted Sponsored Content / Guest Posts or high-authority Niche Edits (In-Content Link Insertions) on existing, indexed posts, Linkerbuddy offers verified inventory across regional and global markets.",
    teamImageAlt: "Linkerbuddy team collaborating on link-building campaigns",
    processImageAlt: "SEO specialists reviewing placement strategy",
    whatWeDo: {
      title: "What we do",
      body: "We manage and curate quality publishers across multiple regions—including Australia, India, North America, Europe, Southeast Asia, and global markets—ensuring every link placement aligns with your specific country target, organic traffic requirements, and Domain Rating (DR/DA) metrics.",
      servicesTitle: "Our core services",
      guestTitle: "Sponsored Guest Posts",
      guestBody:
        "Submit your own article or let us publish high-quality, publisher-ready content tailored to your target niche on authentic, high-traffic blogs.",
      nicheTitle: "Niche Edits (Link Insertions)",
      nicheBody:
        "Get contextual links added directly to existing, established articles that are already indexed and ranking on Google.",
      multiTitle: "Multi-Country Targeting",
      multiBody:
        "Filter inventory by location to execute hyper-local or international link-building campaigns seamlessly.",
    },
    howWeWork: {
      title: "Process",
      kicker: "Direct email negotiation",
      intro:
        "We believe link building shouldn’t be rigid or automated by bots that don’t understand your unique campaign needs. We keep our process personal, flexible, and transparent.",
      cta: "Browse marketplace",
      step1Title: "Explore",
      step1Body:
        "Browse our verified website marketplace filtered by niche, country, DR/DA, and organic traffic.",
      step2Title: "Define targets",
      step2Body:
        "Share your campaign brief—target metrics, budget range, and preferred markets—so we can shortlist the right publishers.",
      step3Title: "Negotiate",
      step3Body:
        "Connect directly with our team via email. We negotiate flexible pricing, bulk discounts, content rules, and turnaround times.",
      step4Title: "Agree terms",
      step4Body:
        "Lock in clear deliverables, anchor guidelines, and timelines tailored to your budget before anything goes live.",
      step5Title: "Publish",
      step5Body:
        "We coordinate publishing with vetted publishers and ensure placements meet the agreed content and quality standards.",
      step6Title: "Track & report",
      step6Body:
        "Receive a live report with verified URLs, anchor text tracking, indexation follow-up, and placement guarantees.",
    },
    why: {
      title: "Why choose us",
      intro:
        "Transparent metrics, multi-country inventory, and flexible email negotiation—built for agencies and brands that need links that actually move rankings.",
      inventoryTitle: "Multi-Country Inventory",
      inventoryBody:
        "Access vetted publisher sites targeting audiences around the globe—from local campaigns to international outreach.",
      metricsTitle: "Transparent Metrics",
      metricsBody:
        "Every site is pre-checked for real organic search traffic, Moz DA, and Ahrefs DR. No spam networks or PBNs.",
      dealsTitle: "Tailored Negotiations",
      dealsBody:
        "Get flexible deals directly through email outreach without rigid marketplace surcharges.",
      policyTitle: "Replacement Assurance",
      policyBody:
        "We stand by our inventory with guaranteed indexation and clear placement protection.",
    },
    cta: {
      title: "That’s our story—feel free to say hi!",
      body: "Have a site list in mind, or need a custom quote for sponsored posts or niche edits? We’re ready when you are.",
      emailLabel: "Email us directly",
      browse: "Browse our inventory",
      contact: "Get in touch",
    },
  },
  blogIndex: {
    heroTitle: "Blog",
    breadcrumb: "Blog",
    subtitle:
      "Guides on guest posts, niche edits, and link building that actually move rankings.",
    featuredLabel: "Featured",
    readArticle: "Read the guide",
    readTime: "{minutes} min read",
    homeTitle: "From the blog",
    browseAll: "Browse all articles",
    openArticle: "Read article",
  },
  blogArticle: {
    category: "Link building",
    breadcrumb: "Niche Edits vs. Guest Posts",
    title: "Niche Edits vs. Guest Posts",
    subtitle:
      "Which Link Building Strategy Drives Faster SEO Results for Your Brand & Clients?",
    readTime: "{minutes} min read",
    tocTitle: "On this page",
    toc: {
      intro: "Off-page SEO",
      definitions: "Guest posts vs niche edits",
      guestBenefits: "Guest post benefits",
      nicheBenefits: "Niche edit benefits",
      compare: "Comparison",
      when: "When to use each",
      why: "Why Linkerbuddy",
      workflow: "How it works",
      combine: "Combine both",
    },
    intro: {
      kicker: "Understanding Off-Page SEO",
      title: "Backlinks still move rankings. The strategy you choose decides how fast.",
      body: "Backlinks build domain authority, push organic rankings higher, and drive targeted traffic. Here is how to choose the right strategy.",
    },
    guest: {
      kicker: "Sponsored content",
      title: "What is a Guest Post?",
      body: "A Sponsored Guest Post involves creating a completely new article to be published on an authority third-party website.",
      point1: "Custom content written specifically around your target keyword and niche.",
      point2: "Contextual backlink placed naturally within the newly published body text.",
      point3: "Ideal for establishing thought leadership and full narrative control.",
      point4: "Helps build long-term brand identity across regional and global blogs.",
    },
    niche: {
      kicker: "In-content link insertions",
      title: "What is a Niche Edit?",
      body: "A Niche Edit places your backlink into an existing, already-indexed article that already holds Google ranking authority.",
      point1:
        "Instead of publishing new content, publishers naturally insert your contextual link and anchor text into an established post.",
      point2:
        "That post already receives organic search traffic — so your link inherits existing authority.",
    },
    guestBenefits: {
      title: "Key Benefits of Guest Posts",
      controlTitle: "Full Control",
      controlBody:
        "Complete control over article topic, tone, content length, and surrounding anchor text structure.",
      brandTitle: "Brand Equity",
      brandBody:
        "Publish valuable industry insights, building authority and thought leadership with new audiences.",
      nicheTitle: "Niche Relevance",
      nicheBody:
        "Articles are custom-crafted specifically to align with your targeted products and market segment.",
    },
    nicheBenefits: {
      title: "Key Benefits of Niche Edits",
      authorityTitle: "Instant Authority",
      authorityBody:
        "Leverages aged pages that are already indexed and carrying historical Google page authority.",
      speedTitle: "Fast Turnaround",
      speedBody:
        "No article writing required. Link placements can go live in a fraction of standard publishing time.",
      costTitle: "Cost Effective",
      costBody:
        "Eliminates content creation expenses, making it ideal for scaling backlink volume on budget.",
    },
    compare: {
      title: "Side-by-Side Comparison",
      feature: "Feature",
      guest: "Guest Posts",
      niche: "Niche Edits (Link Insertions)",
      content: "Content Requirement",
      contentGuest: "New article (800+ words)",
      contentNiche: "Existing, aged article",
      indexing: "Indexing Speed",
      indexingGuest: "Standard (starts from zero)",
      indexingNiche: "Faster (page already indexed)",
      turnaround: "Turnaround Time",
      turnaroundGuest: "Days to weeks",
      turnaroundNiche: "Fast / Priority TAT",
      control: "Context Control",
      controlGuest: "High (full article writing)",
      controlNiche: "Moderate (paragraph placement)",
      objective: "Campaign Objective",
      objectiveGuest: "Brand authority & storytelling",
      objectiveNiche: "Quick ranking impact & budget scale",
    },
    when: {
      title: "Choosing the Right Strategy",
      nicheTitle: "When to Use Niche Edits",
      nicheBody:
        "Best when you need fast indexing, are targeting competitive keyword terms, want to tap into pages with existing search traffic, or need budget-friendly volume.",
      guestTitle: "When to Use Guest Posts",
      guestBody:
        "Best when you want to publish fresh branded stories, maintain absolute control over the surrounding text, and establish authority on top-tier niche publications.",
    },
    why: {
      title: "Why Choose Linkerbuddy?",
      inventoryTitle: "Multi-Country Inventory",
      inventoryBody:
        "Access pre-vetted publisher sites across Australia, India, US, UK, and global regions.",
      metricsTitle: "Verified Metrics",
      metricsBody:
        "Every site is checked for real organic traffic, Moz DA, and Ahrefs DR—no PBNs or spam.",
      dealsTitle: "Direct Email Deals",
      dealsBody:
        "Flexible negotiations via email for custom packages, bulk discounts, and fast turnaround.",
    },
    workflow: {
      title: "Our 4-Step Email Workflow",
      step1Title: "Select",
      step1Body: "Browse inventory or share target DR, traffic & niche requirements.",
      step2Title: "Negotiate",
      step2Body: "Discuss custom pricing, bulk orders & guidelines directly via email.",
      step3Title: "Publish",
      step3Body: "Our team coordinates content insertion or guest post publishing.",
      step4Title: "Report",
      step4Body: "Receive live URLs, anchor tracking, and placement guarantees.",
    },
    combine: {
      kicker: "100% Verified Organic Traffic",
      title: "Combine Both for Maximum Results",
      body: "The strongest SEO campaigns don't rely on a single link type. Combining contextual Niche Edits for speed and Sponsored Guest Posts for brand authority creates a natural, powerful backlink profile search engines love.",
      cta: "Drive Scalable SEO Growth",
    },
    cta: {
      title: "Ready to Scale Your Rankings?",
      body: "Get in touch with our team for custom site shortlists and bulk pricing negotiations.",
      contact: "Get in touch",
      browse: "Browse inventory",
      emailLabel: "Email us directly",
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
