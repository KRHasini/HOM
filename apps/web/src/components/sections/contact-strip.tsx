import { TrackedLink } from "@/components/layout/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { getSite, getUi } from "@/content";
import { formatAddress, telHref, whatsappHref } from "@/lib/contact";

import { Section } from "./section";

/** Final contact strip: big phone number, WhatsApp, address, hours and directions. */
export function ContactStrip({ title, text }: { title: string; text: string }) {
  const site = getSite();
  const copy = getUi().contact;
  return (
    <Section surface="ink-soft" labelledBy="contact-strip-title">
      <div className="container-hom grid gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SplitText id="contact-strip-title" text={title} className="display text-section" />
          <Reveal delay={0.1}>
            <p className="max-w-md font-serif text-lede text-bone/80 italic">{text}</p>
          </Reveal>
        </div>
        <Reveal className="grid gap-8 sm:grid-cols-2 lg:col-span-6" delay={0.15}>
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-muted-dark">{copy.phone}</p>
            <TrackedLink
              href={telHref(site.phone.e164)}
              event="call_click"
              params={{ location: "contact_strip" }}
              className="display text-4xl transition-colors hover:text-gold-light md:text-5xl"
            >
              {site.phone.display}
            </TrackedLink>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-muted-dark">{copy.whatsapp}</p>
            <TrackedLink
              href={whatsappHref(site.whatsapp.number, site.whatsapp.prefill)}
              event="whatsapp_click"
              params={{ location: "contact_strip" }}
              className="w-fit link-underline text-lg text-ivory"
            >
              {copy.whatsappCta}
            </TrackedLink>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-muted-dark">{copy.address}</p>
            <p className="text-bone/85">{formatAddress(site.address)}</p>
            <TrackedLink
              href={site.mapLink}
              event="map_click"
              params={{ location: "contact_strip" }}
              className="w-fit link-underline eyebrow text-gold-light"
            >
              {copy.directions}
            </TrackedLink>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-muted-dark">{copy.hours}</p>
            {site.hours.map((h) => (
              <p key={h.days} className="text-bone/85">
                {h.days} — {h.time}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
