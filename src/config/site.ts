export const siteConfig = {
  name: "Linkerbuddy",
  tagline: "Links that move rankings.",
  description:
    "Browse verified Indian guest post and link insertion placements with transparent pricing and fast turnaround.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og/default.png",
  links: {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
} as const;
