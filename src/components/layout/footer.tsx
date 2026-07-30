"use client";

import Link from "next/link";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/layout/container";
import { useTranslations } from "@/providers/locale-provider";

export function Footer() {
  const t = useTranslations();

  const columns = [
    {
      title: t("footer.marketplace"),
      links: [
        { title: t("footer.indiaSites"), href: "#marketplace" },
        { title: t("footer.adminSites"), href: "#marketplace" },
        { title: t("footer.linkInsertions"), href: "#marketplace" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { title: t("footer.howItWorks"), href: "#how-it-works" },
        { title: t("footer.faqs"), href: "#faq" },
        { title: t("footer.contact"), href: "/contact" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { title: t("footer.privacy"), href: "/privacy" },
        { title: t("footer.terms"), href: "/terms" },
        { title: t("footer.replacement"), href: "/replacement-policy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#06152f] px-0 pt-[55px] pb-[22px] text-[#b5c3d8] dark:bg-[#040914]">
      <Container>
        <div className="grid grid-cols-2 gap-8 tablet:grid-cols-[1.2fr_1.2fr_0.6fr_0.6fr] tablet:gap-[45px]">
          <div className="col-span-2 flex flex-col gap-2.5 tablet:col-span-1">
            <Logo light />
            <p className="m-0 max-w-sm text-[11px] leading-[1.7]">{t("footer.blurb")}</p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-2.5">
              <b className="text-[11px] text-white">{column.title}</b>
              {column.links.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-[10px] text-[#9facbf] no-underline hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-[35px] flex flex-col gap-3 border-t border-white/10 pt-[18px] text-[9px] tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="m-0">
            © {new Date().getFullYear()} {siteConfig.name}. {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-3">
            <span>{t("footer.legalLine")}</span>
            <a
              href={siteConfig.links.linkedin}
              aria-label="LinkedIn"
              className="text-[#9facbf] hover:text-white"
            >
              <FaLinkedinIn size={12} />
            </a>
            <a
              href={siteConfig.links.twitter}
              aria-label="X (Twitter)"
              className="text-[#9facbf] hover:text-white"
            >
              <FaXTwitter size={12} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
