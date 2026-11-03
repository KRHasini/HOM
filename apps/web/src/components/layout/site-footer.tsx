import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { getLegal, getNavigation, getSite } from "@/content";
import { formatAddress, telHref, whatsappHref } from "@/lib/contact";

import { TrackedLink } from "./tracked-link";

/** Compact footer: who we are, how to reach us, where to go next. Nothing the header repeats. */
export async function SiteFooter() {
  const site = getSite();
  const navigation = await getNavigation();
  const legal = getLegal();
  const year = new Date().getFullYear();

  return (
    <footer className="surface-ink pt-16 pb-[calc(var(--action-bar-h)+var(--safe-bottom)+2rem)] md:pt-20 lg:pb-10">
      <div className="container-hom">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Logo name={site.name} size="lg" />
            <ul className="flex gap-6 text-sm">
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

          <address className="flex flex-col gap-3 text-sm text-bone not-italic lg:col-span-4">
            <TrackedLink
              href={telHref(site.phone.e164)}
              event="call_click"
              params={{ location: "footer" }}
              className="w-fit display text-3xl text-ivory transition-colors hover:text-gold-light"
            >
              {site.phone.display}
            </TrackedLink>
            <TrackedLink
              href={whatsappHref(site.whatsapp.number, site.whatsapp.prefill)}
              event="whatsapp_click"
              params={{ location: "footer" }}
              className="w-fit link-underline"
            >
              WhatsApp us
            </TrackedLink>
            <a href={`mailto:${site.email}`} className="w-fit link-underline">
              {site.email}
            </a>
            <p className="mt-2 max-w-xs text-muted-dark">{formatAddress(site.address)}</p>
            <TrackedLink
              href={site.mapLink}
              event="map_click"
              params={{ location: "footer" }}
              className="w-fit link-underline text-gold-light"
            >
              Get directions
            </TrackedLink>
          </address>

          <nav aria-label="Footer" className="lg:col-span-3">
            <ul className="flex flex-col gap-3 text-sm">
              {navigation.header.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-bone hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/faq" className="link-underline text-bone hover:text-ivory">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-muted-dark md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}.
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
