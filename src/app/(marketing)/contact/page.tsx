import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with our team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg">
        <h1 className="text-4xl font-bold">Contact us</h1>
        <p className="mt-4 text-zinc-600">
          Have a question? Fill out the form and we&apos;ll get back to you.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
