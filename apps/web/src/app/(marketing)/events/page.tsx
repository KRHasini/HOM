import type { Metadata } from "next";

import { EventCard, EventsEmpty } from "@/components/sections/events/event-card";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getEvents, getPage, getSite, getUi } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { eventJsonLd } from "@/lib/structured-data";

const page = getPage("events");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/events" });

// Upcoming/past is decided by date: re-evaluate hourly.
export const revalidate = 3600;

export default async function EventsPage() {
  const site = getSite();
  const ui = getUi().events;
  const { upcoming, past } = await getEvents();
  const labelsFor = (status: keyof typeof ui.statusLabels) => ({
    register: ui.register,
    enquire: ui.enquire,
    status: ui.statusLabels[status],
  });

  return (
    <>
      <PageHero {...page.hero} />
      <Section surface="ink" className="pt-16 md:pt-24">
        <div className="container-hom flex flex-col gap-20">
          <section aria-labelledby="upcoming-title" className="flex flex-col gap-8">
            <Eyebrow>
              <span id="upcoming-title">{ui.upcoming}</span>
            </Eyebrow>
            {upcoming.length > 0 ? (
              upcoming.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  labels={labelsFor(e.status)}
                  enquireHref="/contact"
                />
              ))
            ) : (
              <EventsEmpty
                title={ui.emptyTitle}
                text={ui.emptyText}
                cta={
                  site.social.instagram
                    ? { label: ui.followCta, href: site.social.instagram }
                    : undefined
                }
              />
            )}
          </section>
          {past.length > 0 ? (
            <section aria-labelledby="past-title" className="flex flex-col gap-8">
              <Eyebrow>
                <span id="past-title">{ui.past}</span>
              </Eyebrow>
              {past.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  labels={labelsFor(e.status)}
                  enquireHref="/contact"
                  past
                />
              ))}
            </section>
          ) : null}
        </div>
      </Section>
      {upcoming.length > 0 ? <JsonLd data={upcoming.map((e) => eventJsonLd(site, e))} /> : null}
    </>
  );
}
