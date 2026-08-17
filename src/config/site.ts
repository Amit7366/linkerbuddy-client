export const siteConfig = {
  name: "Linkerbuddy",
  tagline: "Links that move rankings.",
  description:
    "Browse verified guest post and link insertion placements with transparent pricing and fast turnaround.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  mark: "/brand/linkerbuddy.svg",
  ogImage: "/og/default.png",
  contact: {
    address: "Dhaka, Bangladesh",
    phoneDisplay: "+880 1709-751603",
    phoneE164: "+8801709751603",
    email: "linkerbuddy@gmail.com",
    workHours: "Mon–Fri 10 am – 6 pm (GMT+6)",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Dhaka%2C%20Bangladesh&z=13&output=embed",
    mapLabel: "Linkerbuddy",
  },
  links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
} as const;
