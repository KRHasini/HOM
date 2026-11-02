"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CheckboxField, TextAreaField, TextField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { FormsCopy } from "@/content/schema";
import { duration, ease } from "@/lib/motion";
import { type ContactFormValues, contactFormSchema } from "@/lib/validation/lead";

import { FormStatus } from "./form-status";
import { Honeypot } from "./honeypot";
import { type SubmissionMessages, useLeadSubmission } from "./use-lead-submission";

interface ContactFormProps {
  copy: FormsCopy;
  consentText: string;
  optionalLabel: string;
  submitting: string;
  sent: string;
  messages: SubmissionMessages;
  whatsappHref: string;
  privacyHref: string;
}

export function ContactForm({
  copy,
  consentText,
  optionalLabel,
  submitting,
  sent,
  messages,
  whatsappHref,
  privacyHref,
}: ContactFormProps) {
  const { state, error, submit } = useLeadSubmission(messages);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", phone: "", email: "", message: "", consent: false },
    mode: "onTouched",
  });
  const values = useWatch({ control });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Honeypot read from the submitted form (bots fill it; humans never see it).
    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    return handleSubmit(async (data) => {
      const result = await submit(
        {
          enquiry_type: "contact",
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          message: data.message || null,
          consent: data.consent,
          source: "website:contact-form",
          website,
        },
        { event: "contact_submitted" },
      );
      if (!result.ok && result.fields) {
        for (const [field, message] of Object.entries(result.fields)) {
          if (field in data) setError(field as keyof ContactFormValues, { message });
        }
      }
    })(event);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "success" ? (
        <m.div
          key="done"
          role="status"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.reveal, ease: ease.expo }}
          className="flex flex-col gap-4 border border-hairline p-8"
        >
          <p className="display text-4xl text-gold-light">{copy.contact.successTitle}</p>
          <p className="text-bone/80">{copy.contact.successText}</p>
        </m.div>
      ) : (
        <m.form key="form" noValidate onSubmit={onSubmit} className="relative flex flex-col gap-4">
          <Honeypot />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label={copy.fields.name}
              autoComplete="name"
              filled={Boolean(values.name)}
              error={errors.name?.message}
              {...register("name")}
            />
            <TextField
              label={copy.fields.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              filled={Boolean(values.phone)}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <TextField
            label={copy.fields.email}
            optionalLabel={optionalLabel}
            type="email"
            autoComplete="email"
            filled={Boolean(values.email)}
            error={errors.email?.message}
            {...register("email")}
          />
          <TextAreaField
            label={copy.fields.message}
            optionalLabel={optionalLabel}
            filled={Boolean(values.message)}
            error={errors.message?.message}
            {...register("message")}
          />
          <CheckboxField
            label={
              <>
                {consentText}{" "}
                <Link href={privacyHref} className="underline underline-offset-2">
                  {copy.links.privacy}
                </Link>
              </>
            }
            error={errors.consent?.message}
            {...register("consent")}
          />
          <div className="pt-2">
            <SubmitButton
              state={state}
              labels={{ idle: copy.contact.submit, loading: submitting, success: sent }}
            />
          </div>
          <FormStatus error={error} whatsapp={{ href: whatsappHref, label: copy.links.whatsapp }} />
        </m.form>
      )}
    </AnimatePresence>
  );
}
