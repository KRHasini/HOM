"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { FormsCopy } from "@/content/schema";
import { track } from "@/lib/analytics";
import { duration, ease } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";
import { type TrialFormValues, trialFormSchema, trialStepFields } from "@/lib/validation/lead";

import { FormStatus } from "./form-status";
import { Honeypot } from "./honeypot";
import { TrialSuccess } from "./trial-success";
import { type SubmissionMessages, useLeadSubmission } from "./use-lead-submission";

export interface TrialWizardProps {
  classes: { slug: string; name: string; tagline: string; accent: string }[];
  copy: FormsCopy;
  consentText: string;
  optionalLabel: string;
  submitting: string;
  sent: string;
  messages: SubmissionMessages;
  whatsapp: { number: string; prefill: string };
  nextSteps: string[];
  privacyHref: string;
}

const STEP_COUNT = 3;

/**
 * Three-step trial booking: (1) who it is for, (2) class and timing, (3) contact
 * details — with a progress indicator, per-step validation and no page reloads.
 */
export function TrialWizard({
  classes,
  copy,
  consentText,
  optionalLabel,
  submitting,
  sent,
  messages,
  whatsapp,
  nextSteps,
  privacyHref,
}: TrialWizardProps) {
  const params = useSearchParams();
  const preselected = classes.some((c) => c.slug === params.get("class"))
    ? params.get("class")!
    : "";

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { state, error, submit } = useLeadSubmission(messages);

  const form = useForm<TrialFormValues>({
    resolver: zodResolver(trialFormSchema),
    defaultValues: {
      audience: undefined,
      age: "",
      classSlug: preselected,
      preferredDays: [],
      preferredTime: undefined,
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
    },
    mode: "onTouched",
  });
  const { register, control, trigger, handleSubmit, setError, formState } = form;
  const { errors } = formState;
  const values = useWatch({ control });
  const t = copy.trial;

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("trial_form_started", { location: "trial_page", preselected: preselected || undefined });
  };

  const focusHeading = () => window.setTimeout(() => headingRef.current?.focus(), 50);

  const goNext = async () => {
    const valid = await trigger([...trialStepFields[step]!], { shouldFocus: true });
    if (!valid) return;
    track("trial_step_completed", { step: step + 1 });
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
    focusHeading();
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    focusHeading();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Honeypot read from the submitted form (bots fill it; humans never see it).
    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    return handleSubmit(
      async (data) => {
        const result = await submit(
          {
            enquiry_type: "trial",
            audience: data.audience,
            age: Number(data.age),
            class_slug: data.classSlug,
            preferred_days: data.preferredDays,
            preferred_time: data.preferredTime,
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            message: data.message || null,
            consent: data.consent,
            source: "website:trial-wizard",
            website,
          },
          { event: "trial_submitted", params: { class: data.classSlug, audience: data.audience } },
        );
        if (!result.ok && result.fields) {
          for (const [field, message] of Object.entries(result.fields)) {
            if (field in data) setError(field as keyof TrialFormValues, { message });
          }
          const firstStep = trialStepFields.findIndex((fields) =>
            fields.some((f) => result.fields && f in result.fields),
          );
          if (firstStep >= 0) setStep(firstStep);
        }
      },
      // Errors on an earlier step (e.g. edited via back) jump to that step.
      (fieldErrors) => {
        const firstStep = trialStepFields.findIndex((fields) =>
          fields.some((f) => f in fieldErrors),
        );
        if (firstStep >= 0 && firstStep !== step) setStep(firstStep);
      },
    )(event);
  };

  if (state === "success") {
    const chosen = classes.find((c) => c.slug === values.classSlug);
    return (
      <TrialSuccess
        copy={t.success}
        summary={[
          {
            label: t.success.summaryLabels.for,
            value: t.audienceOptions.find((o) => o.value === values.audience)?.label ?? "",
          },
          { label: t.success.summaryLabels.class, value: chosen?.name ?? "" },
          {
            label: t.success.summaryLabels.days,
            value: t.dayOptions
              .filter((d) => (values.preferredDays ?? []).includes(d.value))
              .map((d) => d.label)
              .join(", "),
          },
          {
            label: t.success.summaryLabels.time,
            value: t.timeOptions.find((o) => o.value === values.preferredTime)?.label ?? "",
          },
          { label: t.success.summaryLabels.phone, value: values.phone ?? "" },
        ]}
        nextSteps={nextSteps}
        whatsappHref={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent(
          `${whatsapp.prefill} — ${values.name}${chosen ? `, ${chosen.name}` : ""}`,
        )}`}
      />
    );
  }

  const stepCopy = t.steps[step]!;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocus={markStarted}
      className="relative flex flex-col gap-10"
    >
      <Honeypot />

      {/* Progress */}
      <div className="flex flex-col gap-4">
        <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
          {t.steps.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col gap-2"
              aria-current={i === step ? "step" : undefined}
            >
              <span className="relative block h-0.5 overflow-hidden bg-current/15">
                <m.span
                  className="absolute inset-0 origin-left bg-gold"
                  initial={false}
                  animate={{ scaleX: i <= step ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: ease.expo }}
                />
              </span>
              <span
                className={cn(
                  "hidden eyebrow sm:block",
                  i <= step ? "text-gold-light" : "text-current/45",
                )}
              >
                {pad2(i + 1)} · {s.title}
              </span>
            </li>
          ))}
        </ol>
        <p className="eyebrow text-current/60 sm:hidden">
          {t.stepLabel} {step + 1} / {STEP_COUNT}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.fieldset
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: duration.micro + 0.25, ease: ease.expo }}
            className="flex flex-col gap-8"
          >
            <legend className="sr-only">{stepCopy.title}</legend>
            <header className="flex flex-col gap-2">
              <h2 ref={headingRef} tabIndex={-1} className="display text-title outline-none">
                {stepCopy.title}
              </h2>
              <p className="font-serif text-lede text-current/70 italic">{stepCopy.description}</p>
            </header>

            {step === 0 ? (
              <>
                <Controller
                  control={control}
                  name="audience"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-label={t.audienceQuestion}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {t.audienceOptions.map((option) => {
                        const selected = field.value === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex min-h-24 flex-col items-start justify-center gap-1 border p-6 text-left transition-colors duration-300",
                              selected
                                ? "border-gold bg-gold/10"
                                : "border-current/20 hover:border-gold-light",
                            )}
                          >
                            <span className="display text-3xl">{option.label}</span>
                            <span className="text-sm text-current/65">{option.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.audience ? (
                  <p role="alert" className="-mt-4 text-sm text-error-dark">
                    {errors.audience.message}
                  </p>
                ) : null}
                <TextField
                  label={copy.fields.age}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  hint={
                    values.audience === "child" ? copy.fields.ageHintChild : copy.fields.ageHintSelf
                  }
                  filled={Boolean(values.age)}
                  error={errors.age?.message}
                  wrapperClassName="max-w-xs"
                  {...register("age")}
                />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Controller
                  control={control}
                  name="classSlug"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-label={copy.fields.classInterest}
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      {classes.map((c) => {
                        const selected = field.value === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => field.onChange(c.slug)}
                            className={cn(
                              "group/opt flex min-h-16 items-center gap-4 border px-5 py-3 text-left transition-colors duration-300",
                              selected
                                ? "border-gold bg-gold/10"
                                : "border-current/20 hover:border-gold-light",
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className="size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: c.accent }}
                            />
                            <span className="flex flex-col">
                              <span className="font-semibold">{c.name}</span>
                              <span className="text-xs text-current/60">{c.tagline}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.classSlug ? (
                  <p role="alert" className="-mt-4 text-sm text-error-dark">
                    {errors.classSlug.message}
                  </p>
                ) : null}

                <Controller
                  control={control}
                  name="preferredDays"
                  render={({ field }) => (
                    <fieldset className="flex flex-col gap-3">
                      <legend className="mb-3 eyebrow text-current/70">{t.daysQuestion}</legend>
                      <div className="flex flex-wrap gap-2">
                        {t.dayOptions.map((d) => {
                          const selected = field.value.includes(d.value);
                          return (
                            <Chip
                              key={d.value}
                              selected={selected}
                              onClick={() =>
                                field.onChange(
                                  selected
                                    ? field.value.filter((v) => v !== d.value)
                                    : [...field.value, d.value],
                                )
                              }
                            >
                              {d.label}
                            </Chip>
                          );
                        })}
                      </div>
                      {errors.preferredDays ? (
                        <p role="alert" className="text-sm text-error-dark">
                          {errors.preferredDays.message}
                        </p>
                      ) : null}
                    </fieldset>
                  )}
                />

                <Controller
                  control={control}
                  name="preferredTime"
                  render={({ field }) => (
                    <fieldset className="flex flex-col gap-3">
                      <legend className="mb-3 eyebrow text-current/70">{t.timeQuestion}</legend>
                      <div
                        className="flex flex-wrap gap-2"
                        role="radiogroup"
                        aria-label={t.timeQuestion}
                      >
                        {t.timeOptions.map((o) => (
                          <Chip
                            key={o.value}
                            selected={field.value === o.value}
                            role="radio"
                            aria-checked={field.value === o.value}
                            aria-pressed={undefined}
                            onClick={() => field.onChange(o.value)}
                          >
                            {o.label}
                          </Chip>
                        ))}
                      </div>
                      {errors.preferredTime ? (
                        <p role="alert" className="text-sm text-error-dark">
                          {errors.preferredTime.message}
                        </p>
                      ) : null}
                    </fieldset>
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
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
                    hint={copy.fields.phoneHint}
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
              </>
            ) : null}
          </m.fieldset>
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-current/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={goBack} className="w-fit">
            <span className="flex items-center gap-3">
              <ArrowIcon direction="left" className="w-5" />
              {t.back}
            </span>
          </Button>
        ) : (
          <span />
        )}
        {step < STEP_COUNT - 1 ? (
          <Button size="lg" arrow onClick={goNext}>
            {t.next}
          </Button>
        ) : (
          <SubmitButton
            state={state}
            labels={{ idle: t.submit, loading: submitting, success: sent }}
          />
        )}
      </div>
      <FormStatus
        error={error}
        whatsapp={{
          href: `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.prefill)}`,
          label: copy.links.whatsapp,
        }}
      />
    </form>
  );
}
