import { ImageReveal } from "@/components/motion/image-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedImage } from "@/lib/media";

import { Section } from "../section";

interface FounderSpotlightProps {
  eyebrow: string;
  name: string;
  quote: string;
  bio: string;
  photo: ResolvedImage;
  cta: { label: string; href: string };
}

/** Founder spotlight: giant name in motion, portrait, pull quote and a call to action. */
export function FounderSpotlight({ eyebrow, name, quote, bio, photo, cta }: FounderSpotlightProps) {
  return (
    <Section surface="ink" labelledBy="founder-title" className="overflow-hidden">
      <Marquee speed={1.2} className="pointer-events-none select-none" direction={1}>
        {[0, 1, 2].map((n) => (
          <span
            key={n}
            aria-hidden="true"
            className="px-8 display text-[clamp(6rem,18vw,17rem)] leading-[0.85] text-gold/40 text-outline"
          >
            {name}
          </span>
        ))}
      </Marquee>

      <div className="relative container-hom -mt-8 grid items-end gap-12 md:-mt-16 lg:grid-cols-12">
        <ImageReveal className="relative aspect-[4/5] lg:col-span-5">
          <SmartImage image={photo} sizes="(min-width: 1024px) 40vw, 100vw" />
        </ImageReveal>

        <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:pb-8">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="founder-title" className="display text-title">
              {name}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <blockquote className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-10 -left-2 font-serif text-[7rem] leading-none text-gold/30"
              >
                “
              </span>
              <p className="relative font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.15] italic">
                {quote}
              </p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-lg text-bone/75">{bio}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <Magnetic>
              <ButtonLink href={cta.href} variant="secondary" arrow className="text-ivory">
                {cta.label}
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
