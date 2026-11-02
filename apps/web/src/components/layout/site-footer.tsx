import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { DrawLine } from "@/components/motion/draw-line";
import { SplitText } from "@/components/motion/split-text";
import { getLegal, getNavigation, getSite } from "@/content";
import { getBrandAssets } from "@/lib/brand.server";
import { formatAddress, telHref, whatsappHref } from "@/lib/contact";

import { TrackedLink } from "./tracked-link";

export async function SiteFooter() {
  const site = getSite();
  const navigation = await getNavigation();
  const legal = getLegal();
  const brand = getBrandAssets();
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden surface-ink pt-24 pb-[calc(var(--action-bar-h)+var(--safe-bottom)+2rem)] md:pt-32 lg:pb-12">
      <div className="container-hom">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-6">
            <Logo src={brand.logoWhite} name={site.name} shortName={site.shortName} size="lg" />
            <p className="eyebrow text-gold-light">{site.tagline}</p>
          </div>
          <SplitText
            as="p"
            text={site.closing.split(/(?<=\.)\s+/)}
            className="display text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.92] text-ivory lg:text-right"
          />
        </div>

        <DrawLine className="my-16 md:my-20" />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <address className="flex flex-col gap-5 not-italic lg:col-span-4">
            <p className="eyebrow text-muted-dark">Visit & contact</p>
            <TrackedLink
              href={telHref(site.phone.e164)}
              event="call_click"
              params={{ location: "footer" }}
              className="w-fit display text-4xl text-ivory transition-colors hover:text-gold-light"
            >
              {site.phone.display}
            </TrackedLink>
            <TrackedLink
              href={whatsappHref(site.whatsapp.number, site.whatsapp.prefill)}
              event="whatsapp_click"
              params={{ location: "footer" }}
              className="w-fit link-underline text-bone"
            >
              WhatsApp us
            </TrackedLink>
            <a href={`mailto:${site.email}`} className="w-fit link-underline text-bone">
              {site.email}
            </a>
            <p className="max-w-xs text-sm text-muted-dark">{formatAddress(site.address)}</p>
            <TrackedLink
              href={site.mapLink}
              event="map_click"
              params={{ location: "footer" }}
              className="w-fit link-underline eyebrow text-gold-light"
            >
              Get directions
            </TrackedLink>
          </address>

          {navigation.footer.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="flex flex-col gap-5 lg:col-span-2"
            >
              <p className="eyebrow text-muted-dark">{group.title}</p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-bone hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-5 lg:col-span-2">
            <p className="eyebrow text-muted-dark">Hours</p>
            <ul className="flex flex-col gap-2 text-sm text-bone">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="block text-ivory">{h.days}</span>
                  {h.time}
                </li>
              ))}
            </ul>
            <p className="mt-4 eyebrow text-muted-dark">Follow</p>
            <ul className="flex flex-col gap-3">
              {site.social.instagram ? (
                <li>
                  <TrackedLink
                    href={site.social.instagram}
                    event="instagram_click"
                    params={{ location: "footer" }}
                    className="link-underline text-bone"
                  >
                    Instagram
                  </TrackedLink>
                </li>
              ) : null}
              {site.social.youtube ? (
                <li>
                  <TrackedLink
                    href={site.social.youtube}
                    event="youtube_click"
                    params={{ location: "footer" }}
                    className="link-underline text-bone"
                  >
                    YouTube
                  </TrackedLink>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-hairline-soft pt-8 text-xs text-muted-dark md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. {site.signature}.
            {legal.registration.visible ? ` ${legal.registration.text}` : null}
          </p>
          <ul className="flex gap-6">
            {navigation.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
