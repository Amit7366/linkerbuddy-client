"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createLead } from "@/lib/api/leads";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().optional(),
  privacyAccepted: z
    .boolean()
    .refine((value) => value === true, "Please agree to the privacy policy"),
});

const inputClass =
  "mt-1.5 flex h-11 w-full min-w-0 max-w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    privacyAccepted: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    setLoading(true);
    try {
      await createLead({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        privacyAccepted: true,
        source: "contact_form",
      });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "", privacyAccepted: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green/30 bg-green/10 p-5 text-sm leading-relaxed text-ink">
        Thank you. We received your message and will get back to you shortly. We
        will let you know within 3 business days.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 w-full space-y-4">
      <div className="grid min-w-0 grid-cols-1 gap-4 phablet:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="name" className="text-[13px] font-semibold text-ink">
            Name
          </label>
          <input
            id="name"
            className={inputClass}
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="email" className="text-[13px] font-semibold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="min-w-0">
        <label htmlFor="subject" className="text-[13px] font-semibold text-ink">
          Subject
        </label>
        <input
          id="subject"
          className={inputClass}
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
      </div>
      <div className="min-w-0">
        <label htmlFor="message" className="text-[13px] font-semibold text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Message"
          className={cn(inputClass, "h-auto min-h-[132px] py-3")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-3 pt-1 phablet:flex-row phablet:items-center phablet:justify-between">
        <label className="flex min-w-0 items-start gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[var(--blue)]"
            checked={form.privacyAccepted}
            onChange={(e) => setForm({ ...form, privacyAccepted: e.target.checked })}
          />
          <span className="min-w-0 break-words">
            I agree to the{" "}
            <a href="/privacy" className="font-semibold text-brand no-underline hover:underline">
              privacy policy
            </a>
          </span>
        </label>
        <Button type="submit" disabled={loading} className="w-full shrink-0 rounded-xl px-6 phablet:w-auto">
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
