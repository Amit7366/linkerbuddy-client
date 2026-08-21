"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { ScheduleCallForm } from "@/components/forms/schedule-call-form";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const infoCards = [
  {
    title: "Office",
    body: siteConfig.contact.addressLines.join("\n"),
    icon: MapPin,
    tone: "bg-brand/10 text-brand",
  },
  {
    title: "Phone",
    body: siteConfig.contact.phoneDisplay,
    href: `tel:${siteConfig.contact.phoneE164}`,
    icon: Phone,
    tone: "bg-orange/15 text-[#c47a00]",
  },
  {
    title: "Work Hours",
    body: siteConfig.contact.workHours,
    icon: Clock3,
    tone: "bg-navy/10 text-navy dark:bg-navy/25 dark:text-[var(--logo-accent)]",
  },
  {
    title: "Email",
    body: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    tone: "bg-green/15 text-green",
  },
] as const;

const socials = [
  { href: siteConfig.links.facebook, label: "Facebook", icon: FaFacebookF },
  { href: siteConfig.links.twitter, label: "X", icon: FaXTwitter },
  { href: siteConfig.links.linkedin, label: "LinkedIn", icon: FaLinkedinIn },
  { href: siteConfig.links.instagram, label: "Instagram", icon: FaInstagram },
  { href: siteConfig.links.telegram, label: "Telegram", icon: FaTelegram },
  {
    href: `https://wa.me/${siteConfig.contact.phoneE164.replace(/^\+/, "")}`,
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
] as const;

export function ContactPageContent() {
  const [tab, setTab] = useState<"message" | "call">("message");

  return (
    <div className="bg-page">
      <section className="relative overflow-hidden bg-navy px-4 py-16 text-center tablet:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-page [clip-path:polygon(0_100%,100%_0,100%_100%)]"
        />
        <h1 className="m-0 text-[clamp(1.7rem,6vw,3rem)] font-bold tracking-[-0.04em] text-white">
          Feel free to get in touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">
          Talk with Linkerbuddy about guest posts, custom campaigns, and agency
          partnerships — with transparent pricing and no extra commitments.
        </p>
      </section>

      <section className="overflow-x-clip pb-20">
        <Container className="relative z-10">
          <div className="grid min-w-0 items-start gap-10 tablet:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] tablet:gap-12">
            <div className="min-w-0 -mt-8 rounded-[22px] border border-line bg-card p-4 shadow-[var(--shadow-product)] phablet:p-6 tablet:-mt-12 tablet:p-8">
              <div className="mb-6 grid min-w-0 grid-cols-2 gap-1 rounded-2xl bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setTab("message")}
                  className={cn(
                    "min-w-0 rounded-xl px-2 py-2.5 text-center text-[12px] leading-tight font-bold phablet:px-4 phablet:text-[13px]",
                    tab === "message" ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  Leave your message
                </button>
                <button
                  type="button"
                  onClick={() => setTab("call")}
                  className={cn(
                    "min-w-0 rounded-xl px-2 py-2.5 text-center text-[12px] leading-tight font-bold phablet:px-4 phablet:text-[13px]",
                    tab === "call" ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  Schedule a call
                </button>
              </div>
              {tab === "message" ? (
                <>
                  <h2 className="mt-0 mb-5 text-xl font-bold tracking-[-0.03em] text-ink tablet:text-2xl">
                    Leave your message
                  </h2>
                  <ContactForm />
                </>
              ) : (
                <>
                  <h2 className="mt-0 mb-2 text-xl font-bold tracking-[-0.03em] text-ink tablet:text-2xl">
                    Schedule a strategy call
                  </h2>
                  <p className="mt-0 mb-5 text-sm text-muted">
                    30 minutes with our team. Pick a time in your timezone.
                  </p>
                  <ScheduleCallForm />
                </>
              )}
            </div>

            <div className="min-w-0 pt-2 tablet:pt-16">
              <h2 className="mt-0 text-[clamp(1.25rem,4vw,1.65rem)] font-bold tracking-[-0.03em] text-ink">
                Don&apos;t hesitate to contact us
              </h2>
              <p className="mt-3 mb-7 text-[15px] leading-relaxed text-muted">
                Whether you need a single verified placement or a white-label
                campaign, our editors and account team are ready to help you
                move rankings with real sites.
              </p>
              <div className="grid grid-cols-1 gap-3 phablet:grid-cols-2 tablet:grid-cols-1">
                {infoCards.map((card) => {
                  const Icon = card.icon;
                  const inner = (
                    <>
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-full",
                          card.tone,
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                          {card.title}
                        </span>
                        <span className="mt-1 block whitespace-pre-line break-words [overflow-wrap:anywhere] text-sm font-semibold text-ink">
                          {card.body}
                        </span>
                      </span>
                    </>
                  );
                  const className =
                    "flex min-w-0 items-start gap-3 rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-table)]";
                  if ("href" in card && card.href) {
                    return (
                      <a key={card.title} href={card.href} className={`${className} no-underline`}>
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <div key={card.title} className={className}>
                      {inner}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-ink">Social Media :</span>
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white no-underline shadow-[var(--shadow-btn)] transition hover:-translate-y-0.5 hover:bg-brand-hover"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
