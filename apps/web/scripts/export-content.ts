/**
 * pnpm content:export
 *
 * Validates the typed content layer and writes the snapshot the API seed script loads
 * (apps/api/app/scripts/seed_data/content.json), so the database tables always mirror
 * the website content. Run after editing classes, instructors, testimonials, gallery
 * or events. `--check` fails if the committed snapshot is stale (CI).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { classes } from "../src/content/classes";
import { events } from "../src/content/events";
import { gallery } from "../src/content/gallery";
import manifest from "../src/content/generated/media-manifest.json";
import { instructors } from "../src/content/instructors";
import {
  ClassSchema,
  EventSchema,
  GallerySchema,
  InstructorSchema,
  TestimonialSchema,
} from "../src/content/schema";
import { testimonials } from "../src/content/testimonials";

const OUT = path.resolve(import.meta.dirname, "../../api/app/scripts/seed_data/content.json");
const sizes = manifest as Record<string, { width: number; height: number } | undefined>;

const parsedClasses = z.array(ClassSchema).parse(classes);
const parsedInstructors = z.array(InstructorSchema).parse(instructors);
const parsedTestimonials = z.array(TestimonialSchema).parse(testimonials);
const parsedEvents = z.array(EventSchema).parse(events);
const parsedGallery = GallerySchema.parse(gallery);

const snapshot = {
  classes: parsedClasses.map((c) => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description.join("\n\n"),
    category: c.category,
    age_group: c.audiences.join(", "),
    level: c.level,
    duration_minutes: c.durationMinutes,
    accent: c.accent,
    sort_order: c.sortOrder,
    instructor_slugs: c.instructorIds,
  })),
  instructors: parsedInstructors.map((i) => ({
    slug: i.slug,
    name: i.name,
    role: i.role,
    bio: i.bio.join("\n\n"),
    specialties: i.specialties,
    photo_path: i.photo.src,
    is_placeholder: i.placeholder,
    sort_order: i.sortOrder,
  })),
  testimonials: parsedTestimonials.map((t) => ({
    slug: t.id,
    name: t.name,
    relation: t.relation,
    quote: t.quote,
    class_slug: t.classSlug ?? null,
    is_placeholder: t.placeholder,
    sort_order: t.sortOrder,
  })),
  gallery: parsedGallery.items.map((item, index) => {
    const size =
      item.kind === "image"
        ? sizes[item.media.src]
        : { width: item.media.width, height: item.media.height };
    return {
      path: item.media.src,
      kind: item.kind,
      category: item.category,
      caption: item.caption,
      width: size?.width ?? 1600,
      height: size?.height ?? 2000,
      poster_path: item.kind === "video" ? item.media.poster : null,
      sort_order: index,
    };
  }),
  events: parsedEvents.map((e) => ({
    slug: e.id,
    title: e.title,
    starts_at: e.startsAt,
    ends_at: e.endsAt ?? null,
    venue: e.venue,
    description: e.description,
    image_path: e.image?.src ?? null,
    registration_url: e.registrationUrl ?? null,
    status: e.status === "cancelled" ? "cancelled" : "published",
    is_placeholder: e.placeholder,
  })),
};

async function main() {
  const next = `${JSON.stringify(snapshot, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    const current = await readFile(OUT, "utf8").catch(() => "");
    if (current !== next) {
      console.error("Seed snapshot is stale. Run `pnpm content:export`.");
      process.exit(1);
    }
    console.log("Seed snapshot is up to date.");
    return;
  }
  await writeFile(OUT, next);
  console.log(
    `Exported ${snapshot.classes.length} classes, ${snapshot.instructors.length} instructors, ` +
      `${snapshot.testimonials.length} testimonials, ${snapshot.gallery.length} gallery items, ` +
      `${snapshot.events.length} events → ${path.relative(process.cwd(), OUT)}`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
