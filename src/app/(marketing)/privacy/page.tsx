import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${siteConfig.name} handles contact and booking information.`,
});

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-4xl font-bold tracking-[-0.04em] text-ink">Privacy policy</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        When you submit the contact form or schedule a call, we store your name, email,
        phone (if provided), and message so our team can reply. We use this information
        only to respond to your inquiry, book strategy calls, and improve Linkerbuddy.
        We do not sell your details. You can ask us to delete your submission by emailing{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </Container>
  );
}
