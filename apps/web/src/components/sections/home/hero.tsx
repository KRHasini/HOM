"use client";

import { m } from "motion/react";

import { HomMark } from "@/components/brand/hom-mark";
import { DrawLine } from "@/components/motion/draw-line";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedVideo } from "@/lib/media";
import { ease } from "@/lib/motion";

import { HeroMedia } from "./hero-media";

interface HeroProps {
  eyebrow: string;
  headline: string[];
  signature: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  scrollCue: string;
  video: ResolvedVideo;
}

/**
 * Hero intro: over a darkened looping video, the HOM mark and the brand line reveal
 * word by word while a thin gold line draws across; a scroll cue pulses below.
 */
export function Hero({
  eyebrow,
  headline,
  signature,
  primaryCta,
  secondaryCta,
  scrollCue,
  video,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      data-surface="dark"
      className="grain relative flex min-h-svh flex-col overflow-hidden bg-ink text-ivory"
    >
      <HeroMedia video={video} />

      <div className="relative z-[3] container-hom flex flex-1 flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-28 md:pb-24">
        <Reveal delay={0.1} y={12}>
          <Eyebrow className="mb-6 md:mb-8" rule={false}>
            <m.span
              className="inline-flex text-gold-light"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: ease.expo }}
            >
              <HomMark className="h-6 w-6" />
            </m.span>
            {eyebrow}
          </Eyebrow>
        </Reveal>

        <SplitText
          as="h1"
          id="hero-title"
          trigger="mount"
          delay={0.25}
          stagger={0.12}
          text={headline}
          className="display text-[min(var(--text-hero),21svh)] leading-[0.84]"
          lineClassName="even:pl-[0.6em] md:even:pl-[1.4em] last:text-gold-light"
        />

        <div className="relative mt-6 md:mt-8">
          <DrawLine immediate delay={0.9} className="max-w-3xl" />
        </div>

        <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={1.1} y={16}>
            <p className="font-script text-[clamp(2.25rem,5vw,3.75rem)] leading-none text-gold-light">
              {signature}
            </p>
          </Reveal>
          <Reveal
            delay={1.25}
            y={16}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Magnetic>
              <ButtonLink href={primaryCta.href} size="lg" arrow className="w-full sm:w-auto">
                {primaryCta.label}
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href={secondaryCta.href}
              variant="secondary"
              size="lg"
              className="text-ivory"
            >
              {secondaryCta.label}
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <m.div
        className="absolute bottom-6 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="eyebrow text-[0.625rem] text-bone/70">{scrollCue}</span>
        <span className="relative h-12 w-px overflow-hidden bg-bone/15">
          <span className="absolute inset-0 animate-scroll-cue bg-gold-light" />
        </span>
      </m.div>
    </section>
  );
}
