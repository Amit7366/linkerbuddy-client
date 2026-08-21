"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextInput } from "@/components/ui/field";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { useToast } from "@/components/ui/toast";
import { CTA_BUDGETS, CTA_NICHES } from "@/config/landing";
import { useTranslations } from "@/providers/locale-provider";
import { CtaAiModal, type CtaBrief } from "@/components/marketing/cta-ai-modal";

export function CtaForm() {
  const { showToast } = useToast();
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [brief, setBrief] = useState<CtaBrief | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const niche = String(data.get("niche") ?? "");
    const budget = String(data.get("budget") ?? "");
    const email = String(data.get("email") ?? "").trim();

    if (!niche || !budget || !email) return;

    setSubmitting(true);
    setBrief({ niche, budget, email });
    setModalOpen(true);
    showToast(t("cta.toast"));
    form.reset();
    setSubmitting(false);
  };

  return (
    <section id="custom-list" className="py-14 tablet:py-[70px]" aria-labelledby="cta-heading">
      <Container>
        <Reveal>
          <div className="grid items-center gap-7 rounded-[20px] bg-[image:var(--cta-gradient)] p-5 text-white shadow-[var(--shadow-cta)] phablet:p-7 tablet:grid-cols-[0.8fr_1.2fr] tablet:gap-[55px] tablet:p-[42px]">
            <div>
              <p className="lb-kicker lb-kicker-light">{t("cta.kicker")}</p>
              <h2 id="cta-heading" className="my-3 text-[clamp(1.6rem,4vw,1.95rem)] font-bold tracking-[-1.3px]">
                {t("cta.title")}
              </h2>
              <p className="m-0 text-[13px] leading-relaxed text-white/70">{t("cta.description")}</p>
            </div>

            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 gap-2.5 tablet:grid-cols-2"
              aria-label={t("cta.kicker")}
            >
              <Field label={t("cta.niche")}>
                <Select name="niche" defaultValue={CTA_NICHES[0]} required>
                  {CTA_NICHES.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={t("cta.budget")}>
                <Select name="budget" defaultValue={CTA_BUDGETS[0]} required>
                  {CTA_BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={t("cta.email")} className="tablet:col-span-1">
                <TextInput
                  name="email"
                  type="email"
                  placeholder={t("cta.emailPlaceholder")}
                  required
                  autoComplete="email"
                />
              </Field>

              <Button
                type="submit"
                className="h-[50px] w-full !bg-[#F00E58] shadow-[0_12px_28px_rgba(240,14,88,0.38)] hover:!bg-[#d40c4c]"
                disabled={submitting}
              >
                {t("cta.submit")}
              </Button>
            </form>
          </div>
        </Reveal>
      </Container>

      <CtaAiModal
        open={modalOpen}
        brief={brief}
        onClose={() => {
          setModalOpen(false);
          setBrief(null);
        }}
      />
    </section>
  );
}
