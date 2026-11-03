/** JSON-LD builders (schema.org). All data comes from the content layer. */
import type { ResolvedClass, ResolvedEvent, ResolvedInstructor } from "@/content";
import { brand } from "@/content/brand.config";
import type { FaqItem, Site } from "@/content/schema";

type JsonLd = Record<string, unknown>;

const abs = (site: Site, path: string) => new URL(path, site.url).toString();
const orgId = (site: Site) => `${site.url}#organization`;

const isPlaceholderAddress = (site: Site) => site.address.pincode === "000000";

export function organizationJsonLd(site: Site, classes: ResolvedClass[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["DanceSchool", "LocalBusiness"],
    "@id": orgId(site),
    name: site.name,
    alternateName: site.shortName,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    logo: abs(site, brand.logo.blackPng),
    image: abs(site, "/opengraph-image"),
    sameAs: Object.values(site.social).filter(Boolean),
    hasMap: site.mapLink,
    ...(isPlaceholderAddress(site)
      ? { areaServed: site.address.country }
      : {
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.line,
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            postalCode: site.address.pincode,
            addressCountry: site.address.countryCode,
          },
        }),
    ...(site.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng } }
      : {}),
    founder: { "@type": "Person", name: site.owner.name, jobTitle: site.owner.role },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Classes",
      itemListElement: classes.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name: c.name, url: abs(site, c.href) },
      })),
    },
  };
}

export function personJsonLd(site: Site, person: ResolvedInstructor): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: person.shortBio,
    worksFor: { "@id": orgId(site) },
    url: abs(site, "/instructors"),
    ...(person.photo.exists ? { image: abs(site, person.photo.src) } : {}),
    sameAs: Object.values(person.social).filter(Boolean),
    knowsAbout: person.classes.map((c) => c.name),
  };
}

export function courseJsonLd(site: Site, course: ResolvedClass): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.name} classes`,
    description: course.summary,
    url: abs(site, course.href),
    image: course.cover.exists ? abs(site, course.cover.src) : undefined,
    provider: { "@type": "Organization", "@id": orgId(site), name: site.name, sameAs: site.url },
    inLanguage: site.language,
    educationalLevel: course.level,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: { "@id": orgId(site) },
      ...(course.durationMinutes ? { courseWorkload: `PT${course.durationMinutes}M` } : {}),
    },
    offers: { "@type": "Offer", category: "Free trial", price: 0, priceCurrency: "INR" },
  };
}

export function faqJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function eventJsonLd(site: Site, event: ResolvedEvent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventStatus: {
      scheduled: "https://schema.org/EventScheduled",
      cancelled: "https://schema.org/EventCancelled",
      postponed: "https://schema.org/EventPostponed",
    }[event.status],
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.venue },
    organizer: { "@id": orgId(site), name: site.name, url: site.url },
    ...(event.image?.exists ? { image: abs(site, event.image.src) } : {}),
    ...(event.registrationUrl ? { url: event.registrationUrl } : {}),
  };
}

export function breadcrumbJsonLd(site: Site, trail: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(site, crumb.path),
    })),
  };
}
