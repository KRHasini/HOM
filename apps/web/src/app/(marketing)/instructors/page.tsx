import type { Metadata } from "next";
import Link from "next/link";

import { TrackedLink } from "@/components/layout/tracked-link";
import { InstagramIcon, YoutubeIcon } from "@/components/icons/social";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SmartImage } from "@/components/media/smart-image";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFounder, getInstructors, getPage, getSite, getUi } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { personJsonLd } from "@/lib/structured-data";

const page = getPage("instructors");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/instructors" });

export default async function InstructorsPage() {
  const site = getSite();
  const copy = getUi().instructors;
  const [founder, all] = await Promise.all([getFounder(), getInstructors()]);
  const team = all.filter((i) => i.slug !== founder.slug);

  return (
    <>
      <PageHero {...page.hero} />

      {/* Founder long-form profile */}
      <Section surface="ivory" labelledBy="founder-name">
        <div className="container-hom grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <ImageReveal className="aspect-[4/5] rounded-xs">
                <SmartImage image={founder.photo} sizes="(min-width: 1024px) 40vw, 100vw" preload />
              </ImageReveal>
              <div className="mt-6 flex gap-2">
                {founder.social.instagram ? (
                  <TrackedLink
                    href={founder.social.instagram}
                    event="instagram_click"
                    params={{ location: "founder_profile" }}
                    aria-label="Instagram"
                    className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    <InstagramIcon className="size-5" />
                  </TrackedLink>
                ) : null}
                {founder.social.youtube ? (
                  <TrackedLink
                    href={founder.social.youtube}
                    event="youtube_click"
                    params={{ location: "founder_profile" }}
                    aria-label="YouTube"
                    className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    <YoutubeIcon className="size-5" />
                  </TrackedLink>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12 lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="founder-name"
              eyebrow={copy.founderEyebrow}
              title={founder.name}
              intro={founder.role}
              surface="light"
            />
            <div className="flex flex-col gap-6">
              {founder.bio.map((p, i) => (
                <Reveal key={p} delay={i * 0.05}>
                  <p className={i === 0 ? "font-serif text-lede" : "text-muted"}>{p}</p>
                </Reveal>
              ))}
            </div>

            {founder.philosophy ? (
              <Reveal className="border-l-2 border-gold pl-6">
                <p className="mb-3 eyebrow text-gold-deep">{copy.philosophy}</p>
                <p className="font-serif text-[clamp(1.25rem,2vw,1.75rem)] leading-snug italic">
                  {founder.philosophy}
                </p>
              </Reveal>
            ) : null}

            <dl className="grid gap-8 sm:grid-cols-2">
              <Reveal>
                <dt className="mb-3 eyebrow text-muted">{copy.teaches}</dt>
                <dd className="flex flex-wrap gap-2">
                  {founder.classes.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.href}
                      className="rounded-full border border-ink/20 px-3 py-1 text-sm transition-colors hover:border-gold-deep hover:text-gold-deep"
                    >
                      {c.name}
                    </Link>
                  ))}
                </dd>
              </Reveal>
              {founder.specialties.length > 0 ? (
                <Reveal delay={0.05}>
                  <dt className="mb-3 eyebrow text-muted">{copy.specialties}</dt>
                  <dd className="text-ink/85">{founder.specialties.join(" · ")}</dd>
                </Reveal>
              ) : null}
              {founder.experience ? (
                <Reveal delay={0.1}>
                  <dt className="mb-3 eyebrow text-muted">{copy.experience}</dt>
                  <dd className="text-ink/85">{founder.experience}</dd>
                </Reveal>
              ) : null}
              {founder.achievements.length > 0 ? (
                <Reveal delay={0.15} className="sm:col-span-2">
                  <dt className="mb-3 eyebrow text-muted">{copy.achievements}</dt>
                  <dd>
                    <ul className="flex flex-col gap-2">
                      {founder.achievements.map((a) => (
                        <li key={a.text} className="flex items-center gap-3 text-ink/80">
                          <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                          {a.text}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </Reveal>
              ) : null}
            </dl>
          </div>
        </div>
      </Section>

      {/* Team */}
      {team.length > 0 ? (
        <Section surface="ink" labelledBy="team-title">
          <div className="container-hom flex flex-col gap-12">
            <Eyebrow>
              <span id="team-title">{copy.team}</span>
            </Eyebrow>
            <RevealGroup as="ul" className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((ins) => (
                <RevealItem as="li" key={ins.slug} className="flex flex-col gap-5">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xs">
                    <SmartImage
                      image={ins.photo}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="display text-3xl">{ins.name}</h3>
                    <p className="eyebrow text-gold-light">{ins.role}</p>
                    <p className="text-bone/70">{ins.shortBio}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {ins.classes.map((c) => (
                        <li key={c.slug}>
                          <Link href={c.href} className="link-underline text-sm text-bone/85">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <JsonLd data={personJsonLd(site, founder)} />
    </>
  );
}
