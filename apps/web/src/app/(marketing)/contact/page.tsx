import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { TrackedLink } from "@/components/layout/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { MapEmbed } from "@/components/sections/contact/map-embed";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getFormsCopy, getLegal, getPage, getSite, getUi } from "@/content";
import { formatAddress, telHref, whatsappHref } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";

const page = getPage("contact");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/contact" });

export default function ContactPage() {
  const site = getSite();
  const ui = getUi();
  const copy = ui.contact;
  const wa = whatsappHref(site.whatsapp.number, site.whatsapp.prefill);
  const address = formatAddress(site.address);

  const rows = [
    {
      label: copy.phone,
      content: (
        <TrackedLink
          href={telHref(site.phone.e164)}
          event="call_click"
          params={{ location: "contact_page" }}
          className="display text-4xl hover:text-gold-light"
        >
          {site.phone.display}
        </TrackedLink>
      ),
    },
    {
      label: copy.whatsapp,
      content: (
        <TrackedLink
          href={wa}
          event="whatsapp_click"
          params={{ location: "contact_page" }}
          className="link-underline text-lg"
        >
          {copy.whatsappCta}
        </TrackedLink>
      ),
    },
    {
      label: copy.email,
      content: (
        <a href={`mailto:${site.email}`} className="link-underline text-lg">
          {site.email}
        </a>
      ),
    },
    { label: copy.address, content: <p className="text-bone/85">{address}</p> },
    {
      label: copy.hours,
      content: site.hours.map((h) => (
        <p key={h.days} className="text-bone/85">
          {h.days} — {h.time}
        </p>
      )),
    },
    {
      label: copy.social,
      content: (
        <div className="flex gap-6">
          {site.social.instagram ? (
            <TrackedLink
              href={site.social.instagram}
              event="instagram_click"
              params={{ location: "contact_page" }}
              className="link-underline"
            >
              Instagram
            </TrackedLink>
          ) : null}
          {site.social.youtube ? (
            <TrackedLink
              href={site.social.youtube}
              event="youtube_click"
              params={{ location: "contact_page" }}
              className="link-underline"
            >
              YouTube
            </TrackedLink>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHero {...page.hero} />
      <Section surface="ink" className="pt-16 md:pt-24">
        <div className="container-hom grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Eyebrow>{copy.detailsTitle}</Eyebrow>
            <dl className="flex flex-col">
              {rows.map((row, i) => (
                <Reveal
                  key={row.label}
                  delay={i * 0.05}
                  className="flex flex-col gap-2 border-b border-hairline-soft py-6"
                >
                  <dt className="eyebrow text-muted-dark">{row.label}</dt>
                  <dd>{row.content}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border border-hairline bg-ink-soft p-6 md:p-10">
              <p className="mb-6 eyebrow text-gold-light">{copy.formTitle}</p>
              <ContactForm
                copy={getFormsCopy()}
                consentText={getLegal().formConsent}
                optionalLabel={ui.forms.optional}
                submitting={ui.forms.submitting}
                sent={ui.forms.success}
                messages={ui.forms}
                whatsappHref={wa}
                privacyHref="/privacy"
              />
            </div>
          </div>
        </div>
      </Section>
      <Section surface="ink-soft" labelledBy="map-title">
        <div className="container-hom flex flex-col gap-8">
          <Eyebrow>
            <span id="map-title">{copy.mapTitle}</span>
          </Eyebrow>
          <MapEmbed
            embedUrl={site.mapEmbedUrl}
            mapLink={site.mapLink}
            title={`${site.name} — ${copy.mapTitle}`}
            loadLabel={copy.mapLoad}
            directionsLabel={copy.directions}
            address={address}
          />
        </div>
      </Section>
    </>
  );
}
