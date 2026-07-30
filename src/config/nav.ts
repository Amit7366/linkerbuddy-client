export const marketingNav = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Pricing", href: "/pricing" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
] as const;

export const shopNav = [
  { title: "Products", href: "/products" },
  { title: "Cart", href: "/cart" },
] as const;

export const crmNav = [
  { title: "Dashboard", href: "/crm/dashboard" },
  { title: "Leads", href: "/crm/leads" },
  { title: "Customers", href: "/crm/customers" },
  { title: "Deals", href: "/crm/deals" },
  { title: "Orders", href: "/crm/orders" },
  { title: "Analytics", href: "/crm/analytics" },
] as const;

export const accountNav = [
  { title: "Orders", href: "/account/orders" },
  { title: "Wishlist", href: "/account/wishlist" },
  { title: "Profile", href: "/account/settings/profile" },
] as const;
