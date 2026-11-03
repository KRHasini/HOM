import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ResolvedImage } from "@/lib/media";

import { Section } from "../section";

interface AboutTeaserProps {
  title: string;
  body: string;
  link: { label: string; href: string };
  portrait: ResolvedImage;
  founderName: string;
  founderRole: string;
}

/** Founder portrait beside a single paragraph — the one place the home page tells the story. */
export function AboutTeaser({
  title,
  body,
  link,
  portrait,
  founderName,
  founderRole,
}: AboutTeaserProps) {
  return (
    <Section surface="ivory" labelledBy="about-teaser-title">
      <div className="container-hom grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="flex flex-col gap-4 lg:col-span-5">
          <ImageReveal className="relative aspect-[4/5] rounded-sm">
            <SmartImage image={portrait} sizes="(min-width: 1024px) 40vw, 100vw" />
          </ImageReveal>
          <figcaption className="text-sm text-muted">
            {founderName} · {founderRole}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
          <SectionHeading id="about-teaser-title" title={title} surface="light" size="title" />
          <Reveal delay={0.1}>
            <p className="max-w-lg font-serif text-lede text-ink">{body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink href={link.href} variant="ghost" arrow className="text-ink">
              {link.label}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
