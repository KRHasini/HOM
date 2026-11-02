import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { TrackView } from "@/components/analytics/track-view";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SmartImage } from "@/components/media/smart-image";
import { ClassCard } from "@/components/sections/classes/class-card";
import { ClassHero } from "@/components/sections/classes/class-hero";
import { StickyClassCta } from "@/components/sections/classes/sticky-class-cta";
import { FaqList } from "@/components/sections/faq-list";
import { Section } from "@/components/sections/section";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getClassBySlug,
  getClasses,
  getFaqsByIds,
  getInstructorsBySlugs,
  getRelatedClasses,
  getSite,
  getUi,
} from "@/content";
import { classMeta } from "@/lib/class-meta";
import { whatsappHref } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/structured-data";
import { cn, pad2 } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getClasses()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/classes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getClassBySlug(slug);
  if (!item) return {};
  return buildMetadata(getSite(), {
    title: `${item.name} Classes`,
    description: `${item.tagline} ${item.summary}`,
    path: item.href,
    image: item.cover.exists ? { src: item.cover.src, alt: item.cover.alt } : undefined,
  });
}

export default async function ClassDetailPage(props: PageProps<"/classes/[slug]">) {
  const { slug } = await props.params;
  const item = await getClassBySlug(slug);
  if (!item) notFound();

  const site = getSite();
  const ui = getUi();
  const copy = ui.classes.detail;
  const [instructors, related] = await Promise.all([
    getInstructorsBySlugs(item.instructorIds),
    getRelatedClasses(item.slug),
  ]);
  const faqs = getFaqsByIds(item.faqIds);
  const meta = classMeta(item, ui.classes);
  const trialHref = `/trial?class=${item.slug}`;
  const bookLabel = `${copy.book} ${item.name}`;
  const serif = item.treatment === "warm-serif";
  const theme = {
    "--accent": item.accent,
    "--accent-contrast": item.accentContrast,
    "--accent-on-dark": item.accentOnDark,
  } as CSSProperties;
  const title = (template: string) => template.replace("{class}", item.name);
  const facts = [
    { label: copy.facts.category, value: ui.classes.categoryLabels[item.category] },
    {
      label: copy.facts.audience,
      value: item.audiences.map((a) => ui.classes.audienceLabels[a]).join(" · "),
    },
    { label: copy.facts.level, value: item.level },
    item.durationMinutes
      ? { label: copy.facts.duration, value: `${item.durationMinutes} ${ui.classes.durationUnit}` }
      : null,
    { label: copy.fees, value: site.features.showPrices ? item.priceText : copy.feesOnRequest },
  ].filter((f) => f !== null);

  return (
    <div style={theme}>
      <TrackView event="class_viewed" params={{ class: item.slug }} />
      <ClassHero
        item={item}
        eyebrow={ui.classes.categoryLabels[item.category]}
        meta={meta}
        trialLabel={bookLabel}
        trialHref={trialHref}
        whatsapp={{
          href: whatsappHref(site.whatsapp.number, `${site.whatsapp.prefill} (${item.name})`),
          label: ui.contact.whatsapp,
        }}
      />

      {/* About + key facts */}
      <Section
        surface={item.treatment === "calm-cream" ? "paper" : "ivory"}
        labelledBy="about-class"
      >
        <div className="container-hom grid gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <SectionHeading
              id="about-class"
              eyebrow={copy.about}
              title={item.tagline}
              surface="light"
              size="title"
            />
            {item.description.map((p, i) => (
              <Reveal key={p} delay={0.05 * i}>
                <p
                  className={cn(
                    i === 0 ? "font-serif text-lede" : "text-muted",
                    serif && i === 0 && "italic",
                  )}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal
            as="dl"
            className="flex flex-col self-start border-t border-ink/15 lg:col-span-4 lg:col-start-9"
          >
            {facts.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-6 border-b border-ink/15 py-4">
                <dt className="eyebrow text-muted">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Benefits */}
      <Section surface="ink" labelledBy="benefits-title">
        <div className="container-hom flex flex-col gap-14">
          <SectionHeading
            id="benefits-title"
            eyebrow={copy.benefits}
            title={title(copy.titles.benefits)}
          />
          <RevealGroup as="ol" className="grid border-t border-hairline md:grid-cols-2">
            {item.benefits.map((b, i) => (
              <RevealItem
                as="li"
                key={b.title}
                className="flex gap-6 border-b border-hairline py-8 md:odd:pr-10 md:even:border-l md:even:pl-10"
              >
                <span className="display text-5xl leading-none text-accent-on-dark md:text-6xl">
                  {pad2(i + 1)}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className={cn("text-2xl", serif ? "font-serif italic" : "display")}>
                    {b.title}
                  </h3>
                  <p className="text-bone/75">{b.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Who it is for */}
      <Section surface="ivory" labelledBy="who-title">
        <div className="container-hom grid items-center gap-14 lg:grid-cols-12">
          <ImageReveal className="aspect-[4/5] lg:col-span-5">
            <SmartImage
              image={item.gallery[0] ?? item.cover}
              sizes="(min-width: 1024px) 40vw, 100vw"
              treatment={item.treatment === "monochrome" ? "monochrome" : "editorial"}
            />
          </ImageReveal>
          <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="who-title"
              eyebrow={copy.whoFor}
              title={title(copy.titles.whoFor)}
              surface="light"
              size="title"
            />
            <RevealGroup as="ul" className="flex flex-col">
              {item.whoFor.map((w) => (
                <RevealItem
                  as="li"
                  key={w}
                  className="flex items-start gap-4 border-b border-ink/10 py-5 text-lg"
                >
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-accent" />
                  {w}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* What to expect */}
      <Section surface="ink-soft" labelledBy="expect-title">
        <div className="container-hom flex flex-col gap-14">
          <SectionHeading
            id="expect-title"
            eyebrow={copy.expect}
            title={title(copy.titles.expect)}
          />
          <RevealGroup as="ol" className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            <span
              aria-hidden="true"
              className="absolute top-7 right-0 left-0 hidden h-px bg-hairline md:block"
            />
            {item.expect.map((s, i) => (
              <RevealItem as="li" key={s.title} className="relative flex flex-col gap-4">
                <span className="relative grid size-14 place-items-center rounded-full border border-accent-on-dark bg-ink-soft font-semibold text-accent-on-dark">
                  {pad2(i + 1)}
                </span>
                <h3 className="display text-3xl">{s.title}</h3>
                <p className="text-bone/75">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Schedule (placeholder-safe) + instructor */}
      <Section surface="ink" labelledBy="schedule-title">
        <div className="container-hom grid gap-16 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Eyebrow>{copy.schedule}</Eyebrow>
            <SplitText id="schedule-title" text={copy.schedule} className="display text-title" />
            {item.schedule.placeholder ? (
              <Reveal className="flex flex-col gap-6 border border-hairline p-8">
                <p className="font-serif text-lede italic">{ui.classes.scheduleFallback}</p>
                <ButtonLink href={trialHref} arrow className="w-fit">
                  {bookLabel}
                </ButtonLink>
              </Reveal>
            ) : (
              <Reveal>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-hairline eyebrow text-bone/60">
                      <th scope="col" className="py-3">
                        {copy.scheduleColumns.days}
                      </th>
                      <th scope="col" className="py-3">
                        {copy.scheduleColumns.time}
                      </th>
                      <th scope="col" className="py-3">
                        {copy.scheduleColumns.batch}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.schedule.slots.map((slot) => (
                      <tr
                        key={`${slot.days}-${slot.time}`}
                        className="border-b border-hairline-soft"
                      >
                        <td className="py-4">{slot.days}</td>
                        <td className="py-4">{slot.time}</td>
                        <td className="py-4 text-bone/70">{slot.batch ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
            )}
          </div>
          {instructors.length > 0 ? (
            <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
              <Eyebrow>{copy.instructor}</Eyebrow>
              {instructors.map((ins) => (
                <Link
                  key={ins.slug}
                  href="/instructors"
                  className="group/ins flex items-center gap-5 border-b border-hairline pb-6"
                >
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-full">
                    <SmartImage image={ins.photo} sizes="80px" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="display text-2xl">{ins.name}</span>
                    <span className="text-sm text-bone/65">{ins.role}</span>
                  </span>
                  <ArrowIcon className="w-6 text-gold-light transition-transform duration-500 ease-expo group-hover/ins:translate-x-1" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      {/* Mini gallery */}
      {item.gallery.length > 1 ? (
        <Section
          surface="ink"
          padded={false}
          className="pb-(--section-y)"
          labelledBy="class-gallery-title"
        >
          <div className="container-hom flex flex-col gap-10">
            <Eyebrow>
              <span id="class-gallery-title">{copy.gallery}</span>
            </Eyebrow>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {item.gallery.map((g, i) => (
                <ImageReveal
                  key={g.src}
                  delay={i * 0.08}
                  className={cn(
                    "aspect-[3/4]",
                    i === 0 && "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-[3/4]",
                  )}
                >
                  <SmartImage
                    image={g}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    treatment={item.treatment === "monochrome" ? "monochrome" : "editorial"}
                  />
                </ImageReveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <Section surface="ivory" labelledBy="class-faq-title">
          <div className="container-hom grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="class-faq-title"
                eyebrow={copy.faq}
                title={title(copy.titles.faq)}
                surface="light"
                size="title"
              />
            </div>
            <div className="lg:col-span-8">
              <FaqList items={faqs} />
            </div>
          </div>
        </Section>
      ) : null}

      {/* Related */}
      <Section surface="ink" labelledBy="related-title">
        <div className="container-hom flex flex-col gap-12">
          <SectionHeading
            id="related-title"
            eyebrow={copy.related}
            title={title(copy.titles.related)}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((r, i) => (
              <li key={r.slug}>
                <ClassCard
                  index={i}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  item={{
                    slug: r.slug,
                    name: r.name,
                    tagline: r.tagline,
                    href: r.href,
                    cover: r.cover,
                    accent: r.accent,
                    accentContrast: r.accentContrast,
                    accentOnDark: r.accentOnDark,
                    treatment: r.treatment,
                    meta: classMeta(r, ui.classes),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <StickyClassCta label={bookLabel} href={trialHref} slug={item.slug} />
      <JsonLd
        data={[
          courseJsonLd(site, item),
          breadcrumbJsonLd(site, [
            { name: site.name, path: "/" },
            { name: "Classes", path: "/classes" },
            { name: item.name, path: item.href },
          ]),
        ]}
      />
    </div>
  );
}
