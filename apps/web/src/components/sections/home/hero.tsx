import { HomMark } from "@/components/brand/hom-mark";
import { IntroLine, IntroRise, IntroText, introDelay } from "@/components/motion/intro";
import { Magnetic } from "@/components/motion/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedVideo } from "@/lib/media";

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
 *
 * The intro is pure CSS so it plays from the first paint, before hydration — the
 * headline is the LCP element and must never wait for JavaScript.
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
        <IntroRise>
          <Eyebrow className="mb-6 md:mb-8" rule={false}>
            <span className="inline-flex hero-spin text-gold-light">
              <HomMark className="h-8" />
            </span>
            {eyebrow}
          </Eyebrow>
        </IntroRise>

        <IntroText
          id="hero-title"
          text={headline}
          delay={190}
          stagger={110}
          className="display text-[min(var(--text-hero),21svh)] leading-[0.84]"
          lineClassName="even:pl-[0.6em] md:even:pl-[1.4em] last:text-gold-light"
        />

        <IntroLine delay={450} className="mt-6 max-w-3xl md:mt-8" />

        <div className="mt-6 flex flex-col gap-8 md:mt-8 lg:flex-row lg:items-end lg:justify-between">
          <IntroRise delay={600}>
            <p className="font-script text-[clamp(2.25rem,5vw,3.75rem)] leading-none text-gold-light">
              {signature}
            </p>
          </IntroRise>
          <IntroRise
            delay={720}
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
          </IntroRise>
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 z-[3] hidden -translate-x-1/2 hero-rise flex-col items-center gap-3 md:flex"
        style={introDelay(1400)}
        aria-hidden="true"
      >
        <span className="eyebrow text-[0.625rem] text-bone/70">{scrollCue}</span>
        <span className="relative h-12 w-px overflow-hidden bg-bone/15">
          <span className="absolute inset-0 animate-scroll-cue bg-gold-light" />
        </span>
      </div>
    </section>
  );
}
