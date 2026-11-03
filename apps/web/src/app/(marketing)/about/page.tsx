import type { Metadata } from "next";

import { DrawLine } from "@/components/motion/draw-line";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SmartImage } from "@/components/media/smart-image";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAbout, getFounder, getNavigation, getSite } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { pad2 } from "@/lib/utils";

const about = getAbout();

export const metadata: Metadata = buildMetadata(getSite(), {
  ...about.seo,
  path: "/about",
  image: about.hero.image.exists
    ? { src: about.hero.image.src, alt: about.hero.image.alt }
    : undefined,
});

export default async function AboutPage() {
  const site = getSite();
  const [founder, navigation] = await Promise.all([getFounder(), getNavigation()]);

  return (
    <>
      <PageHero {...about.hero} />

      {/* Story */}
      <Section surface="ivory" labelledBy="story-title">
        <div className="container-hom grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="story-title"
              eyebrow={about.story.eyebrow}
              title={about.story.title}
              surface="light"
              size="title"
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            {about.story.paragraphs.map((p, i) => (
              <Reveal key={p} delay={i * 0.06}>
                <p className={i === 0 ? "font-serif text-lede" : "text-muted"}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Philosophy: Move. Express. Transform. */}
      <Section surface="ink" labelledBy="philosophy-title">
        <div className="container-hom flex flex-col gap-16">
          <Reveal>
            <Eyebrow>
              <span id="philosophy-title">{about.philosophy.eyebrow}</span>
            </Eyebrow>
          </Reveal>
          <ol className="flex flex-col">
            {about.philosophy.words.map((w, i) => (
              <li
                key={w.word}
                className="grid gap-4 border-t border-hairline py-10 md:grid-cols-12 md:items-end md:gap-8"
              >
                <span className="eyebrow text-gold-light md:col-span-1">{pad2(i + 1)}</span>
                <SplitText
                  as="h3"
                  text={`${w.word}.`}
                  className={`display text-[clamp(2.75rem,6vw,4.5rem)] leading-[1] md:col-span-8 ${i === 2 ? "text-gold-light" : ""}`}
                />
                <Reveal delay={0.2} className="md:col-span-3">
                  <p className="font-serif text-lede text-bone/80 italic">{w.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* The space */}
      <Section surface="ivory" labelledBy="space-title">
        <div className="container-hom grid items-end gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <SectionHeading
              id="space-title"
              eyebrow={about.space.eyebrow}
              title={about.space.title}
              surface="light"
              size="title"
            />
            <Reveal>
              <p className="text-muted">{about.space.text}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-5 gap-4 lg:col-span-8">
            {about.space.images.map((img, i) => (
              <ImageReveal
                key={img.src}
                delay={i * 0.12}
                className={i === 0 ? "col-span-3 aspect-[4/5]" : "col-span-2 mt-24 aspect-[3/4]"}
              >
                <SmartImage image={img} sizes="(min-width: 1024px) 35vw, 60vw" />
              </ImageReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section surface="ink-soft" labelledBy="values-title">
        <div className="container-hom flex flex-col gap-14">
          <SectionHeading
            id="values-title"
            eyebrow={about.values.eyebrow}
            title={about.values.title}
          />
          <RevealGroup
            as="ul"
            className="grid gap-px overflow-hidden bg-hairline-soft sm:grid-cols-2 lg:grid-cols-4"
          >
            {about.values.items.map((v, i) => (
              <RevealItem as="li" key={v.title} className="flex flex-col gap-4 bg-ink-soft p-8">
                <span className="eyebrow text-gold-light">{pad2(i + 1)}</span>
                <h3 className="display text-3xl">{v.title}</h3>
                <p className="text-bone/70">{v.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Founder's note */}
      <Section surface="ivory" labelledBy="note-title">
        <div className="container-hom grid items-center gap-14 lg:grid-cols-12">
          <ImageReveal className="aspect-[4/5] lg:col-span-4">
            <SmartImage image={founder.photo} sizes="(min-width: 1024px) 30vw, 100vw" />
          </ImageReveal>
          <div className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6">
            <Reveal>
              <Eyebrow className="text-gold-deep">{about.founderNote.eyebrow}</Eyebrow>
            </Reveal>
            <h2 id="note-title" className="sr-only">
              {about.founderNote.title}
            </h2>
            {about.founderNote.quote.map((q, i) => (
              <Reveal key={q} delay={i * 0.08}>
                <p className="font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.25] italic">
                  {q}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <p className="font-script text-5xl text-gold-deep">{about.founderNote.signoff}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Timeline (placeholder-safe) */}
      <Section surface="ink" labelledBy="timeline-title">
        <div className="container-hom flex flex-col gap-14">
          <SectionHeading
            id="timeline-title"
            eyebrow={about.timeline.eyebrow}
            title={about.timeline.title}
          />
          <DrawLine />
          <RevealGroup as="ol" className="grid gap-10 md:grid-cols-3">
            {about.timeline.items.map((t) => (
              <RevealItem as="li" key={t.title} className="flex flex-col gap-3">
                <span className="display text-5xl text-gold-light">{t.label}</span>
                <h3 className="display text-2xl">{t.title}</h3>
                <p className="text-bone/70">{t.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>


      <Section surface="ink" labelledBy="closing-title" className="text-center">
        <div className="container-hom flex flex-col items-center gap-10">
          <SplitText
            id="closing-title"
            text={site.closing.split(/(?<=\.)\s+/)}
            className="display text-section"
          />
          <Reveal delay={0.2}>
            <ButtonLink href={navigation.cta.trial.href} size="lg" arrow>
              {navigation.cta.trial.label}
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd(site, [
          { name: site.name, path: "/" },
          { name: about.seo.title, path: "/about" },
        ])}
      />
    </>
  );
}
