/**
 * Content accessors — the only way pages read content.
 *
 * - Collections come from a ContentSource (local files today, API behind
 *   CONTENT_SOURCE=api later) and are memoised per request with React `cache`.
 * - Media is resolved at build time: real files are used when present, otherwise
 *   components render the art-directed MediaPlaceholder.
 * - Entries flagged `placeholder` are visible in development only.
 */
import "server-only";

import { cache } from "react";
import { z } from "zod";

import { isProduction } from "@/lib/env";
import type { ResolvedImage, ResolvedVideo } from "@/lib/media";
import { resolveImage, resolveVideo } from "@/lib/media.server";

import { about as aboutContent } from "./about";
import { faqs as faqContent } from "./faqs";
import { forms as formsContent } from "./forms";
import { home as homeContent } from "./home";
import { legal as legalContent } from "./legal";
import { navigation as navigationContent } from "./navigation";
import { pages as pagesContent } from "./pages";
import {
  AboutSchema,
  type Audience,
  type ClassCategory,
  type DanceClass,
  FaqGroupSchema,
  FormsCopySchema,
  type FaqItem,
  type GalleryCategory,
  HomeSchema,
  type Instructor,
  LegalSchema,
  NavigationSchema,
  type PageKey,
  PagesSchema,
  SiteSchema,
  StatSchema,
  type StudioEvent,
  type Testimonial,
  UiCopySchema,
} from "./schema";
import { site as siteContent } from "./site.config";
import { getContentSource } from "./source";
import { stats as statsContent } from "./stats";
import { ui as uiContent } from "./ui";

const showPlaceholders = !isProduction;
const isVisible = (item: { placeholder: boolean }) => showPlaceholders || !item.placeholder;

// ------------------------------------------------------------ static content

const site = SiteSchema.parse(siteContent);
const navigation = NavigationSchema.parse(navigationContent);
const home = HomeSchema.parse(homeContent);
const about = AboutSchema.parse(aboutContent);
const pages = PagesSchema.parse(pagesContent);
const legal = LegalSchema.parse(legalContent);
const ui = UiCopySchema.parse(uiContent);
const forms = FormsCopySchema.parse(formsContent);
const faqGroups = z.array(FaqGroupSchema).parse(faqContent);
const stats = z.array(StatSchema).parse(statsContent);

export type { Site } from "./schema";

export const getSite = () => site;
export const getUi = () => ui;
export const getFormsCopy = () => forms;
export const getLegal = () => legal;
export const getPage = (key: PageKey) => pages[key];

export const getNavigation = cache(async () => {
  const showTestimonials = await hasTestimonials();
  const hide = (href: string) => href === "/testimonials" && !showTestimonials;
  return {
    ...navigation,
    header: navigation.header.filter((l) => !hide(l.href)),
    footer: navigation.footer.map((g) => ({ ...g, links: g.links.filter((l) => !hide(l.href)) })),
  };
});

// ------------------------------------------------------------------ classes

export type ResolvedClass = Omit<DanceClass, "cover" | "gallery"> & {
  href: string;
  cover: ResolvedImage;
  gallery: ResolvedImage[];
};

const toResolvedClass = (c: DanceClass): ResolvedClass => ({
  ...c,
  href: `/classes/${c.slug}`,
  cover: resolveImage(c.cover),
  gallery: c.gallery.map(resolveImage),
});

export const getClasses = cache(
  async (filter: { category?: ClassCategory; audience?: Audience } = {}) => {
    const all = await getContentSource().classes();
    return all
      .filter((c) => !filter.category || c.category === filter.category)
      .filter((c) => !filter.audience || c.audiences.includes(filter.audience))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toResolvedClass);
  },
);

export const getClassBySlug = cache(async (slug: string) => {
  const all = await getClasses();
  return all.find((c) => c.slug === slug) ?? null;
});

export async function getRelatedClasses(slug: string, limit = 3) {
  const all = await getClasses();
  const current = all.find((c) => c.slug === slug);
  return all
    .filter((c) => c.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === current?.category) - Number(a.category === current?.category) ||
        a.sortOrder - b.sortOrder,
    )
    .slice(0, limit);
}

// -------------------------------------------------------------- instructors

export type ResolvedInstructor = Omit<Instructor, "photo"> & {
  photo: ResolvedImage;
  classes: { slug: string; name: string; href: string }[];
};

export const getInstructors = cache(async (): Promise<ResolvedInstructor[]> => {
  const [all, classes] = await Promise.all([getContentSource().instructors(), getClasses()]);
  return all
    .filter(isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => ({
      ...i,
      achievements: i.achievements.filter(isVisible),
      photo: resolveImage(i.photo),
      classes: classes
        .filter((c) => c.instructorIds.includes(i.slug))
        .map((c) => ({ slug: c.slug, name: c.name, href: c.href })),
    }));
});

export async function getInstructorsBySlugs(slugs: string[]) {
  const all = await getInstructors();
  return slugs.map((s) => all.find((i) => i.slug === s)).filter((i) => i !== undefined);
}

export async function getFounder() {
  const all = await getInstructors();
  const founder = all.find((i) => i.slug === site.owner.instructorId);
  if (!founder) throw new Error(`Founder "${site.owner.instructorId}" missing from instructors.ts`);
  return founder;
}

// ------------------------------------------------------------- testimonials

export type ResolvedTestimonial = Omit<Testimonial, "photo" | "video"> & {
  photo?: ResolvedImage;
  video?: ResolvedVideo;
  className?: string;
};

export const getTestimonials = cache(async (): Promise<ResolvedTestimonial[]> => {
  const [all, classes] = await Promise.all([getContentSource().testimonials(), getClasses()]);
  return all
    .filter(isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((t) => ({
      ...t,
      photo: t.photo ? resolveImage(t.photo) : undefined,
      video: t.video ? resolveVideo(t.video) : undefined,
      className: classes.find((c) => c.slug === t.classSlug)?.name,
    }));
});

/** The testimonials section and page hide themselves when this is false. */
export async function hasTestimonials() {
  return (await getTestimonials()).length > 0;
}

// ------------------------------------------------------------------ gallery

export type ResolvedGalleryItem =
  | { id: string; kind: "image"; category: GalleryCategory; caption: string; media: ResolvedImage }
  | { id: string; kind: "video"; category: GalleryCategory; caption: string; media: ResolvedVideo };

export const getGallery = cache(async () => {
  const gallery = await getContentSource().gallery();
  const items: ResolvedGalleryItem[] = gallery.items.map((item) =>
    item.kind === "image"
      ? { ...item, media: resolveImage(item.media) }
      : { ...item, media: resolveVideo(item.media) },
  );
  return { ...gallery, items };
});

// ------------------------------------------------------------------- events

export type ResolvedEvent = Omit<StudioEvent, "image"> & { image?: ResolvedImage };

export const getEvents = cache(async (now: Date = new Date()) => {
  const all = (await getContentSource().events())
    .filter(isVisible)
    .map((e): ResolvedEvent => ({ ...e, image: e.image ? resolveImage(e.image) : undefined }));
  const isUpcoming = (e: ResolvedEvent) => new Date(e.endsAt ?? e.startsAt) >= now;
  return {
    upcoming: all
      .filter(isUpcoming)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)),
    past: all
      .filter((e) => !isUpcoming(e))
      .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)),
  };
});

// --------------------------------------------------------------------- faqs

export const getFaqGroups = () => faqGroups;

const faqIndex = new Map(faqGroups.flatMap((g) => g.items.map((i) => [i.id, i] as const)));

export function getFaqsByIds(ids: string[]): FaqItem[] {
  return ids.map((id) => {
    const item = faqIndex.get(id);
    if (!item) throw new Error(`Unknown FAQ id "${id}" — check src/content/faqs.ts`);
    return item;
  });
}

// -------------------------------------------------------------- page copy

export async function getHome() {
  const classCount = (await getClasses()).length;
  return {
    ...home,
    hero: { ...home.hero, video: resolveVideo(home.hero.video) },
    trust: {
      items: home.trust.items
        .filter((t) => showPlaceholders || t.verified)
        .map((t) => ({ ...t, label: t.label.replace("{classCount}", String(classCount)) })),
    },
  };
}

export function getAbout() {
  return {
    ...about,
    hero: { ...about.hero, image: resolveImage(about.hero.image) },
    space: { ...about.space, images: about.space.images.map(resolveImage) },
    timeline: {
      ...about.timeline,
      items: about.timeline.items.filter(isVisible),
    },
  };
}

/** Stats render only when enabled AND individually verified (`visible`). */
export function getStats() {
  if (!site.features.showStats) return [];
  return stats.filter((s) => s.visible);
}
