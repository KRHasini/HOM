import { ImageReveal } from "@/components/motion/image-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ResolvedImage } from "@/lib/media";

import { Section } from "../section";

interface AboutTeaserProps {
  eyebrow: string;
  title: string;
  body: string[];
  link: { label: string; href: string };
  portrait: ResolvedImage;
  founderName: string;
  founderRole: string;
  studioImage: ResolvedImage;
}

/** Split editorial layout: founder portrait with an offset studio image, story to the right. */
export function AboutTeaser({
  eyebrow,
  title,
  body,
  link,
  portrait,
  founderName,
  founderRole,
  studioImage,
}: AboutTeaserProps) {
  return (
    <Section surface="ivory" labelledBy="about-teaser-title">
      <div className="container-hom grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <ImageReveal className="relative aspect-[4/5] w-[82%] rounded-xs">
            <SmartImage image={portrait} sizes="(min-width: 1024px) 40vw, 82vw" />
          </ImageReveal>
          <ImageReveal
            direction="left"
            delay={0.25}
            className="absolute right-0 -bottom-10 aspect-[4/3] w-[48%] rounded-xs border-[6px] border-ivory shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--ink)_50%,transparent)]"
          >
            <Parallax amount={10} className="absolute inset-0">
              <SmartImage image={studioImage} sizes="(min-width: 1024px) 24vw, 48vw" />
            </Parallax>
          </ImageReveal>
          <Reveal
            delay={0.4}
            className="absolute top-6 -left-2 origin-top-left -rotate-90 lg:-left-6"
          >
            <p className="-translate-x-full eyebrow whitespace-nowrap text-gold-deep">
              {founderName} — {founderRole}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8">
          <SectionHeading
            id="about-teaser-title"
            eyebrow={eyebrow}
            title={title}
            surface="light"
            size="title"
          />
          {body.map((paragraph, i) => (
            <Reveal key={paragraph} delay={0.1 + i * 0.08}>
              <p className={i === 0 ? "font-serif text-lede text-ink" : "text-muted"}>
                {paragraph}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <ButtonLink href={link.href} variant="ghost" arrow className="text-ink">
              {link.label}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
