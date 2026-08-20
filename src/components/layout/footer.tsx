"use client";

import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";
import { useTranslations } from "@/providers/locale-provider";

const socials = [
  {
    href: siteConfig.links.facebook,
    label: "Facebook",
    icon: FaFacebookF,
    className: "bg-[#1877F2]",
  },
  {
    href: siteConfig.links.twitter,
    label: "X (Twitter)",
    icon: FaXTwitter,
    className: "bg-[#000000]",
  },
  {
    href: siteConfig.links.instagram,
    label: "Instagram",
    icon: FaInstagram,
    className:
      "bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]",
  },
  {
    href: siteConfig.links.pinterest,
    label: "Pinterest",
    icon: FaPinterestP,
    className: "bg-[#E60023]",
  },
  {
    href: siteConfig.links.linkedin,
    label: "LinkedIn",
    icon: FaLinkedinIn,
    className: "bg-[#0A66C2]",
  },
  {
    href: siteConfig.links.telegram,
    label: "Telegram",
    icon: FaTelegram,
    className: "bg-[#229ED9]",
  },
] as const;

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-start gap-2 text-[14px] leading-snug text-white/90 no-underline transition-colors hover:text-white"
    >
      <span
        aria-hidden
        className="mt-[2px] shrink-0 text-[13px] font-bold text-brand transition-transform group-hover:translate-x-0.5"
      >
        ›
      </span>
      <span>{children}</span>
    </Link>
  );
}

function ContactBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="m-0 text-[15px] font-bold text-white">{title}</h3>
      <div className="text-[14px] leading-[1.55] text-white/90">{children}</div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations();
  const { contact } = siteConfig;

  const companyLinks = [
    { title: t("footer.home"), href: "/" },
    { title: t("footer.about"), href: "/about" },
    { title: t("footer.contact"), href: "/contact" },
    { title: t("footer.blog"), href: "/blog" },
  ];

  const serviceLinks = [
    { title: t("footer.guestPosts"), href: "#marketplace" },
    { title: t("footer.linkInsertions"), href: "#marketplace" },
    { title: t("footer.nicheEdits"), href: "#marketplace" },
    { title: t("footer.customCampaigns"), href: "/contact" },
  ];

  return (
    <footer className="bg-navy px-0 pt-14 pb-10 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 phablet:grid-cols-2 tablet:grid-cols-4 tablet:gap-8 desktop:gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <ContactBlock title={t("footer.storeAddress")}>
                {contact.addressLines.map((line) => (
                  <p key={line} className="m-0">
                    {line}
                  </p>
                ))}
              </ContactBlock>
              <ContactBlock title={t("footer.callUs")}>
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="text-white/90 no-underline transition-colors hover:text-white"
                >
                  {contact.phoneDisplay}
                </a>
              </ContactBlock>
              <ContactBlock title={t("footer.storeHours")}>
                <p className="m-0">{contact.workHoursWeekday}</p>
                <p className="m-0">{contact.workHoursWeekend}</p>
              </ContactBlock>
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2.5 break-all text-[14px] text-white/90 no-underline transition-colors hover:text-white"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white">
                <FaEnvelope size={11} aria-hidden />
              </span>
              {contact.email}
            </a>
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className={`grid size-8 place-items-center rounded-md text-white no-underline shadow-sm transition-transform hover:-translate-y-0.5 ${item.className}`}
                  >
                    <Icon size={14} aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="m-0 text-[15px] font-bold tracking-[0.06em] text-white uppercase">
              {t("footer.company")}
            </h2>
            <nav className="flex flex-col gap-3" aria-label={t("footer.company")}>
              {companyLinks.map((item) => (
                <FooterLink key={item.href + item.title} href={item.href}>
                  {item.title}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="m-0 text-[15px] font-bold tracking-[0.06em] text-white uppercase">
              {t("footer.services")}
            </h2>
            <nav className="flex flex-col gap-3" aria-label={t("footer.services")}>
              {serviceLinks.map((item) => (
                <FooterLink key={item.href + item.title} href={item.href}>
                  {item.title}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div className="min-h-[220px] overflow-hidden rounded-md ring-1 ring-white/10 phablet:col-span-2 tablet:col-span-1 tablet:min-h-[240px]">
            <iframe
              title={contact.mapLabel}
              src={contact.mapEmbedUrl}
              className="h-full min-h-[220px] w-full border-0 tablet:min-h-[240px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-[12px] text-white/55 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="m-0">
            © {new Date().getFullYear()} {siteConfig.name}. {t("footer.copyright")}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/privacy" className="text-white/55 no-underline hover:text-white">
              {t("footer.privacy")}
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="text-white/55 no-underline hover:text-white">
              {t("footer.terms")}
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/replacement-policy"
              className="text-white/55 no-underline hover:text-white"
            >
              {t("footer.replacement")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
