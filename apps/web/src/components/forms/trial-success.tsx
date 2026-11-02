"use client";

import { m } from "motion/react";
import { useEffect, useRef } from "react";

import { ButtonLink } from "@/components/ui/button";
import { duration, ease, stagger } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

interface TrialSuccessProps {
  copy: {
    eyebrow: string;
    title: string;
    summaryTitle: string;
    nextStepsTitle: string;
    whatsappCta: string;
    homeCta: string;
  };
  summary: { label: string; value: string }[];
  nextSteps: string[];
  whatsappHref: string;
}

/** Confetti-free success: a gold ring draws and closes on a check, then details rise in. */
export function TrialSuccess({ copy, summary, nextSteps, whatsappHref }: TrialSuccessProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => titleRef.current?.focus(), []);

  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.expo } },
  };

  return (
    <m.div
      role="status"
      className="flex flex-col gap-10"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger.loose, delayChildren: 0.6 } } }}
    >
      <svg viewBox="0 0 96 96" className="size-24 text-gold-light" aria-hidden="true" fill="none">
        <m.circle
          cx="48"
          cy="48"
          r="44"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: ease.inOut }}
          style={{ originX: "50%", originY: "50%" }}
        />
        <m.path
          d="M30 49 L43 61 L66 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: ease.expo, delay: 0.85 }}
        />
      </svg>

      <m.div variants={rise} className="flex flex-col gap-3">
        <p className="eyebrow text-gold-light">{copy.eyebrow}</p>
        <h2 ref={titleRef} tabIndex={-1} className="display text-section outline-none">
          {copy.title}
        </h2>
      </m.div>

      <m.div variants={rise} className="grid gap-10 md:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h3 className="eyebrow text-current/60">{copy.summaryTitle}</h3>
          <dl className="flex flex-col">
            {summary
              .filter((row) => row.value)
              .map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-6 border-b border-current/10 py-3"
                >
                  <dt className="text-current/60">{row.label}</dt>
                  <dd className="text-right font-medium">{row.value}</dd>
                </div>
              ))}
          </dl>
        </section>
        <section className="flex flex-col gap-4">
          <h3 className="eyebrow text-current/60">{copy.nextStepsTitle}</h3>
          <ol className="flex flex-col gap-4">
            {nextSteps.map((stepText, i) => (
              <li key={stepText} className="flex gap-4">
                <span className="display text-2xl text-gold-light">{pad2(i + 1)}</span>
                <span className="text-current/80">{stepText}</span>
              </li>
            ))}
          </ol>
        </section>
      </m.div>

      <m.div variants={rise} className="flex flex-col gap-4 sm:flex-row">
        <ButtonLink href={whatsappHref} arrow size="lg">
          {copy.whatsappCta}
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg">
          {copy.homeCta}
        </ButtonLink>
      </m.div>
    </m.div>
  );
}
