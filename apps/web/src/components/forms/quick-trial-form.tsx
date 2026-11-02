"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { type FormEvent, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Magnetic } from "@/components/motion/magnetic";
import { CheckboxField, SelectField, TextField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { track } from "@/lib/analytics";
import { duration, ease, stagger } from "@/lib/motion";
import { type QuickTrialValues, quickTrialSchema } from "@/lib/validation/lead";

import { FormStatus } from "./form-status";
import { Honeypot } from "./honeypot";
import { type SubmissionMessages, useLeadSubmission } from "./use-lead-submission";

export interface QuickTrialFormProps {
  classes: { slug: string; name: string }[];
  copy: {
    name: string;
    phone: string;
    classInterest: string;
    classPlaceholder: string;
    consent: string;
    submit: string;
    submitting: string;
    success: string;
    successTitle: string;
    successText: string;
    fullFormLink: string;
    fullFormHref: string;
    privacyLabel: string;
    whatsappLabel: string;
  };
  messages: SubmissionMessages;
  whatsappHref: string;
  privacyHref: string;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.expo } },
};

/** Short trial form for the home page CTA. Fields rise in with a stagger. */
export function QuickTrialForm({
  classes,
  copy,
  messages,
  whatsappHref,
  privacyHref,
}: QuickTrialFormProps) {
  const started = useRef(false);
  const { state, error, submit } = useLeadSubmission(messages);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<QuickTrialValues>({
    resolver: zodResolver(quickTrialSchema),
    defaultValues: { name: "", phone: "", classSlug: "", consent: false },
    mode: "onTouched",
  });
  const values = useWatch({ control });

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("trial_form_started", { location: "home" });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Honeypot read from the submitted form (bots fill it; humans never see it).
    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    return handleSubmit(async (data) => {
      const result = await submit(
        {
          enquiry_type: "trial",
          name: data.name,
          phone: data.phone,
          class_slug: data.classSlug,
          consent: data.consent,
          source: "website:home-quick-trial",
          website,
        },
        { event: "trial_submitted", params: { class: data.classSlug, location: "home" } },
      );
      if (!result.ok && result.fields) {
        for (const [field, message] of Object.entries(result.fields)) {
          if (field in data) setError(field as keyof QuickTrialValues, { message });
        }
      }
    })(event);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "success" ? (
        <m.div
          key="success"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.reveal, ease: ease.expo }}
          className="flex flex-col gap-4"
          role="status"
        >
          <p className="display text-4xl text-gold-light">{copy.successTitle}</p>
          <p className="text-bone/80">{copy.successText}</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit link-underline text-ivory"
          >
            {copy.whatsappLabel}
          </a>
        </m.div>
      ) : (
        <m.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          onFocus={onStart}
          className="relative flex flex-col gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: stagger.base } } }}
        >
          <Honeypot />
          <m.div variants={fieldVariants}>
            <TextField
              label={copy.name}
              autoComplete="name"
              filled={Boolean(values.name)}
              error={errors.name?.message}
              {...register("name")}
            />
          </m.div>
          <m.div variants={fieldVariants}>
            <TextField
              label={copy.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              filled={Boolean(values.phone)}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </m.div>
          <m.div variants={fieldVariants}>
            <SelectField
              label={copy.classInterest}
              filled={Boolean(values.classSlug)}
              error={errors.classSlug?.message}
              {...register("classSlug")}
            >
              <option value="" disabled hidden>
                {copy.classPlaceholder}
              </option>
              {classes.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </SelectField>
          </m.div>
          <m.div variants={fieldVariants}>
            <CheckboxField
              label={
                <>
                  {copy.consent}{" "}
                  <Link href={privacyHref} className="underline underline-offset-2">
                    {copy.privacyLabel}
                  </Link>
                </>
              }
              error={errors.consent?.message}
              {...register("consent")}
            />
          </m.div>
          <m.div
            variants={fieldVariants}
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <Magnetic>
              <SubmitButton
                state={state}
                labels={{ idle: copy.submit, loading: copy.submitting, success: copy.success }}
              />
            </Magnetic>
            <Link href={copy.fullFormHref} className="w-fit link-underline text-sm text-bone/70">
              {copy.fullFormLink}
            </Link>
          </m.div>
          <FormStatus error={error} whatsapp={{ href: whatsappHref, label: copy.whatsappLabel }} />
        </m.form>
      )}
    </AnimatePresence>
  );
}
