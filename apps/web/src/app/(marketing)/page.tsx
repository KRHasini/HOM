import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactStrip } from "@/components/sections/contact-strip";
import { EventCard, EventsEmpty } from "@/components/sections/events/event-card";
import { FaqList } from "@/components/sections/faq-list";
import { AboutTeaser } from "@/components/sections/home/about-teaser";
import { ClassShowcase } from "@/components/sections/home/class-showcase";
import { FounderSpotlight } from "@/components/sections/home/founder-spotlight";
import { GalleryPreview } from "@/components/sections/home/gallery-preview";
import { Hero } from "@/components/sections/home/hero";
import { Pillars } from "@/components/sections/home/pillars";
import { StatsStrip } from "@/components/sections/home/stats-strip";
import { TrialCta } from "@/components/sections/home/trial-cta";
import { TrustStrip } from "@/components/sections/home/trust-strip";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { Section } from "@/components/sections/section";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAbout,
  getClasses,
  getEvents,
  getFaqsByIds,
  getFormsCopy,
  getFounder,
  getGallery,
  getHome,
  getLegal,
  getSite,
  getStats,
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

export default async function HomePage() {
  const site = getSite();
  const ui = getUi();
  const forms = getFormsCopy();
  const legal = getLegal();
  const about = getAbout();
  const [home, classes, founder, gallery, testimonials, events] = await Promise.all([
    getHome(),
    getClasses(),
    getFounder(),
    getGallery(),
    getTestimonials(),
    getEvents(),
  ]);
  const stats = getStats();
  const upcoming = events.upcoming.slice(0, 2);

  return (
    <>
      <Hero {...home.hero} />
      <TrustStrip items={home.trust.items} />
      <MarqueeBand items={classes.map((c) => c.name)} label={home.showcase.eyebrow} />

      <AboutTeaser
        {...home.about}
        portrait={founder.photo}
        founderName={founder.name}
        founderRole={founder.role}
        studioImage={about.space.images[0] ?? about.hero.image}
      />

      <Section
        surface="ink"
        padded={false}
        labelledBy="showcase-title"
        className="pt-(--section-y)"
      >
        <div className="container-hom flex flex-col gap-8 pb-16 md:flex-row md:items-end md:justify-between lg:pb-0">
          <SectionHeading
            id="showcase-title"
            eyebrow={home.showcase.eyebrow}
            title={home.showcase.title}
            intro={home.showcase.intro}
          />
          <ButtonLink
            href={home.showcase.cta.href}
            variant="ghost"
            arrow
            className="w-fit shrink-0 text-gold-light"
          >
            {home.showcase.cta.label}
          </ButtonLink>
        </div>
        <ClassShowcase
          exploreLabel={home.showcase.exploreLabel}
          classes={classes.map((c) => ({
            slug: c.slug,
            name: c.name,
            tagline: c.tagline,
            summary: c.summary,
            href: c.href,
            cover: c.cover,
            accent: c.accent,
            accentContrast: c.accentContrast,
            accentOnDark: c.accentOnDark,
            treatment: c.treatment,
            meta: classMeta(c, ui.classes),
          }))}
        />
      </Section>

      <Pillars {...home.pillars} />

      <FounderSpotlight
        eyebrow={home.founder.eyebrow}
        name={founder.name}
        quote={home.founder.quote}
        bio={founder.shortBio}
        photo={founder.photo}
        cta={home.founder.cta}
      />

      <StatsStrip eyebrow={home.stats.eyebrow} stats={stats} />

      <GalleryPreview {...home.gallery} items={gallery.items.slice(0, 8)} />

      {testimonials.length > 0 ? (
        <Section surface="ivory" labelledBy="testimonials-title">
          <div className="container-hom grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="testimonials-title"
                eyebrow={home.testimonials.eyebrow}
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

      <Section surface="ink" labelledBy="events-title">
        <div className="container-hom flex flex-col gap-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="events-title"
              eyebrow={home.events.eyebrow}
              title={home.events.title}
            />
            {upcoming.length > 0 ? (
              <ButtonLink
                href={home.events.cta.href}
                variant="ghost"
                arrow
                className="w-fit text-gold-light"
              >
                {home.events.cta.label}
              </ButtonLink>
            ) : null}
          </div>
          {upcoming.length > 0 ? (
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
          ) : (
            <EventsEmpty
              title={home.events.empty.title}
              text={home.events.empty.text}
              cta={
                site.social.instagram
                  ? { label: ui.events.followCta, href: site.social.instagram }
                  : undefined
              }
            />
          )}
        </div>
      </Section>

      <TrialCta
        eyebrow={home.trial.eyebrow}
        title={home.trial.title}
        intro={home.trial.intro}
        formTitle={home.trial.formTitle}
        image={about.hero.image}
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

      <Section surface="ivory" labelledBy="faq-preview-title">
        <div className="container-hom grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <SectionHeading
              id="faq-preview-title"
              eyebrow={home.faq.eyebrow}
              title={home.faq.title}
              surface="light"
              size="title"
            />
            <ButtonLink href={home.faq.cta.href} variant="ghost" arrow className="w-fit text-ink">
              {home.faq.cta.label}
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <FaqList items={getFaqsByIds(home.faq.ids)} />
          </div>
        </div>
      </Section>

      <ContactStrip title={home.contact.title} text={home.contact.text} />
    </>
  );
}
