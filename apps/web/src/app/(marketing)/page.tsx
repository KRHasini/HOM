import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ClassGrid } from "@/components/sections/classes/class-grid";
import { EventCard } from "@/components/sections/events/event-card";
import { AboutTeaser } from "@/components/sections/home/about-teaser";
import { GalleryPreview } from "@/components/sections/home/gallery-preview";
import { Hero } from "@/components/sections/home/hero";
import { TrialCta } from "@/components/sections/home/trial-cta";
import { Section } from "@/components/sections/section";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getClasses,
  getEvents,
  getFormsCopy,
  getFounder,
  getGallery,
  getHome,
  getLegal,
  getSite,
  getTestimonials,
  getUi,
} from "@/content";
import { classMeta } from "@/lib/class-meta";
import { whatsappHref } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";
import { eventJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return buildMetadata(getSite(), { ...home.seo, path: "/", absoluteTitle: true });
}

/**
 * Home: hero → story → classes → moments → kind words → (events) → trial.
 * Everything else (FAQ, stats, contact details, values) lives on its own page or in the footer.
 */
export default async function HomePage() {
  const site = getSite();
  const ui = getUi();
  const forms = getFormsCopy();
  const legal = getLegal();
  const [home, classes, founder, gallery, testimonials, events] = await Promise.all([
    getHome(),
    getClasses(),
    getFounder(),
    getGallery(),
    getTestimonials(),
    getEvents(),
  ]);
  const upcoming = events.upcoming.slice(0, 2);

  return (
    <>
      <Hero
        headline={home.hero.headline}
        primaryCta={home.hero.primaryCta}
        video={home.hero.video}
      />

      <AboutTeaser
        title={home.about.title}
        body={home.about.body[0] ?? ""}
        link={home.about.link}
        portrait={founder.photo}
        founderName={founder.name}
        founderRole={founder.role}
      />

      <Section surface="sand" labelledBy="showcase-title">
        <div className="container-hom flex flex-col gap-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="showcase-title"
              title={home.showcase.title}
              surface="light"
              size="title"
            />
            <ButtonLink
              href={home.showcase.cta.href}
              variant="ghost"
              arrow
              className="w-fit text-ink"
            >
              {home.showcase.cta.label}
            </ButtonLink>
          </div>
          <ClassGrid
            classes={classes.map((c) => ({
              slug: c.slug,
              name: c.name,
              tagline: c.tagline,
              href: c.href,
              cover: c.cover,
              accent: c.accent,
              accentContrast: c.accentContrast,
              accentOnDark: c.accentOnDark,
              treatment: c.treatment,
              category: c.category,
              audiences: c.audiences,
              meta: classMeta(c, ui.classes),
            }))}
            filterable={false}
            labels={{
              filter: ui.classes.filterLabel,
              all: ui.classes.allLabel,
              empty: ui.classes.emptyState,
              categories: ui.classes.categoryLabels,
              audiences: ui.classes.audienceLabels,
            }}
          />
        </div>
      </Section>

      <GalleryPreview
        title={home.gallery.title}
        cta={home.gallery.cta}
        items={gallery.items.slice(0, 4)}
      />

      {testimonials.length > 0 ? (
        <Section surface="sand" labelledBy="testimonials-title">
          <div className="container-hom grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="testimonials-title"
                title={home.testimonials.title}
                surface="light"
                size="title"
              />
            </div>
            <div className="lg:col-span-8">
              <TestimonialsCarousel
                items={testimonials}
                labels={{
                  relationLabels: ui.testimonials.relationLabels,
                  previous: ui.testimonials.previous,
                  next: ui.testimonials.next,
                }}
              />
            </div>
          </div>
        </Section>
      ) : null}

      {/* No placeholder when nothing is scheduled — the section simply doesn't exist. */}
      {upcoming.length > 0 ? (
        <Section surface="ivory" labelledBy="events-title">
          <div className="container-hom flex flex-col gap-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                id="events-title"
                title={home.events.title}
                surface="light"
                size="title"
              />
              <ButtonLink
                href={home.events.cta.href}
                variant="ghost"
                arrow
                className="w-fit text-ink"
              >
                {home.events.cta.label}
              </ButtonLink>
            </div>
            <div className="flex flex-col gap-6">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  enquireHref="/contact"
                  labels={{
                    register: ui.events.register,
                    enquire: ui.events.enquire,
                    status: ui.events.statusLabels[event.status] ?? event.status,
                  }}
                />
              ))}
              <JsonLd data={upcoming.map((e) => eventJsonLd(site, e))} />
            </div>
          </div>
        </Section>
      ) : null}

      <TrialCta
        title={home.trial.title}
        form={{
          classes: classes.map((c) => ({ slug: c.slug, name: c.name })),
          copy: {
            name: forms.fields.name,
            phone: forms.fields.phone,
            classInterest: forms.fields.classInterest,
            classPlaceholder: forms.fields.classPlaceholder,
            consent: legal.formConsent,
            submit: forms.quickTrial.submit,
            submitting: ui.forms.submitting,
            success: ui.forms.success,
            successTitle: forms.contact.successTitle,
            successText: site.trial.responseTime,
            fullFormLink: forms.quickTrial.fullFormLink,
            fullFormHref: "/trial",
            privacyLabel: forms.links.privacy,
            whatsappLabel: forms.links.whatsapp,
          },
          messages: ui.forms,
          whatsappHref: whatsappHref(site.whatsapp.number, site.whatsapp.prefill),
          privacyHref: "/privacy",
        }}
      />
    </>
  );
}
