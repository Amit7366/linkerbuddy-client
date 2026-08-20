export const siteConfig = {
  name: "Linkerbuddy",
  tagline: "Links that move rankings.",
  description:
    "Browse verified guest post and link insertion placements with transparent pricing and fast turnaround.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  mark: "/brand/linkerbuddy.svg",
  ogImage: "/og/default.png",
  contact: {
    addressLines: ["USA - 30 N GOULD ST STE R", "SHERIDAN WY 82801"],
    address: "USA - 30 N GOULD ST STE R, SHERIDAN WY 82801",
    phoneDisplay: "+1 (606) 415-0230",
    phoneE164: "+16064150230",
    email: "linkerbuddy@gmail.com",
    workHoursWeekday: "Mon-Fri: 10:00 - 20:00",
    workHoursWeekend: "Weekend: 12:00 - 16:00",
    workHours: "Mon-Fri: 10:00 - 20:00\nWeekend: 12:00 - 16:00",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=30%20N%20Gould%20St%20Ste%20R%2C%20Sheridan%20WY%2082801&z=15&output=embed",
    mapLabel: "Linkerbuddy",
  },
  links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
    telegram: "https://t.me/linkerbuddy",
    github: "https://github.com",
  },
} as const;
