export const marketplaceCountries = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    href: "#marketplace",
    description: "Verified .in placements",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    href: "#marketplace",
    description: "US authority sites",
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    href: "#marketplace",
    description: "Spanish & LatAm reach",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    href: "#marketplace",
    description: "UK niche publishers",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    href: "#marketplace",
    description: "DACH market sites",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    href: "#marketplace",
    description: "ANZ guest posts",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    href: "#marketplace",
    description: "Canadian inventory",
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    href: "#marketplace",
    description: "Gulf region placements",
  },
] as const;

export type MarketplaceCountry = (typeof marketplaceCountries)[number];
export type MarketplaceCountryCode = MarketplaceCountry["code"];

/**
 * Primary nav, left → right.
 * About is rendered before Marketplace; remaining items follow it.
 */
export const marketingAboutItem = { key: "nav.aboutUs", href: "/about" } as const;

export const marketingPrimaryNav = [
  { key: "nav.services", href: "#services", section: "services" },
  { key: "nav.howItWorks", href: "#how-it-works", section: "how-it-works" },
  { key: "nav.pricing", href: "#pricing", section: "pricing" },
  { key: "nav.contactUs", href: "/contact" },
] as const;

/** More menu, top → bottom (same serial as the page: agencies → blog → resources). */
export const marketingMoreNav = [
  { key: "nav.agencies", href: "#agencies", section: "agencies" },
  { key: "nav.blog", href: "/blog" },
  { key: "nav.resources", href: "#faq", section: "faq" },
] as const;

export type MarketingPrimaryNavItem = (typeof marketingPrimaryNav)[number];
export type MarketingMoreNavItem = (typeof marketingMoreNav)[number];

export const footerNav = {
  company: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  services: [
    { title: "Guest Posts", href: "#marketplace" },
    { title: "Link Insertions", href: "#marketplace" },
    { title: "Niche Edits", href: "#marketplace" },
    { title: "Custom Campaigns", href: "/contact" },
  ],
} as const;

export const shopNav = [
  { title: "Products", href: "/products" },
  { title: "Cart", href: "/cart" },
] as const;

export const crmNav = [
  { title: "Dashboard", href: "/crm/dashboard" },
  { title: "Leads", href: "/crm/leads" },
  { title: "Calls", href: "/crm/calls" },
  { title: "Customers", href: "/crm/customers" },
  { title: "Deals", href: "/crm/deals" },
  { title: "Orders", href: "/crm/orders" },
  { title: "Analytics", href: "/crm/analytics" },
] as const;

export const accountNav = [
  { title: "Overview", href: "/account", icon: "overview", exact: true },
  { title: "My orders", href: "/account/orders", icon: "orders" },
  { title: "Reviews", href: "/account/reviews", icon: "reviews" },
  { title: "Delivery addresses", href: "/account/settings/billing", icon: "addresses" },
  { title: "Recently viewed", href: "/account/recent", icon: "recent" },
  { title: "Favorite items", href: "/account/wishlist", icon: "favorites" },
] as const;

export const accountQuickLinks = [
  { title: "Profile", href: "/account/settings/profile", tone: "profile" },
  { title: "Gifts", href: "/account/gifts", tone: "gifts" },
  { title: "Wallet", href: "/account/wallet", tone: "wallet" },
] as const;

export const accountFooterNav = [
  { title: "Settings", href: "/account/settings/profile", icon: "settings" },
] as const;
