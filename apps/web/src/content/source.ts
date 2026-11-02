import "server-only";

import { createApiClient } from "@hom/api-client";
import { z } from "zod";

import { classes as localClasses } from "./classes";
import { events as localEvents } from "./events";
import { gallery as localGallery } from "./gallery";
import { instructors as localInstructors } from "./instructors";
import {
  ClassSchema,
  type DanceClass,
  EventSchema,
  GallerySchema,
  type Gallery,
  type Instructor,
  InstructorSchema,
  type StudioEvent,
  type Testimonial,
  TestimonialSchema,
} from "./schema";
import { testimonials as localTestimonials } from "./testimonials";

/**
 * Where collection content comes from. `local` (default) reads the typed files in this
 * folder. `api` (CONTENT_SOURCE=api) overlays records edited in the Phase 2 admin on
 * top of the local files, so pages never need rewriting.
 */
export interface ContentSource {
  classes(): Promise<DanceClass[]>;
  instructors(): Promise<Instructor[]>;
  testimonials(): Promise<Testimonial[]>;
  events(): Promise<StudioEvent[]>;
  gallery(): Promise<Gallery>;
}

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in src/content/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Parsed once per server process; a validation error fails `next build`.
const local = {
  classes: parse(z.array(ClassSchema), localClasses, "classes.ts"),
  instructors: parse(z.array(InstructorSchema), localInstructors, "instructors.ts"),
  testimonials: parse(z.array(TestimonialSchema), localTestimonials, "testimonials.ts"),
  events: parse(z.array(EventSchema), localEvents, "events.ts"),
  gallery: parse(GallerySchema, localGallery, "gallery.ts"),
};

export const localSource: ContentSource = {
  classes: async () => local.classes,
  instructors: async () => local.instructors,
  testimonials: async () => local.testimonials,
  events: async () => local.events,
  gallery: async () => local.gallery,
};

/** Overlays API records onto local entries by slug; falls back to local on any error. */
function apiSource(baseUrl: string): ContentSource {
  const api = createApiClient(baseUrl, { next: { revalidate: 300 } } as RequestInit);

  async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error(`[content] API ${label} unavailable, using local content`, error);
      return fallback;
    }
  }

  return {
    classes: () =>
      safe(
        "classes",
        async () => {
          const { data, error } = await api.GET("/v1/classes");
          if (error || !data) throw new Error("request failed");
          const bySlug = new Map(data.map((c) => [c.slug, c]));
          return local.classes
            .filter((c) => bySlug.has(c.slug))
            .map((c) => {
              const remote = bySlug.get(c.slug)!;
              return {
                ...c,
                name: remote.name,
                tagline: remote.tagline,
                sortOrder: remote.sort_order,
                durationMinutes: remote.duration_minutes ?? c.durationMinutes,
                instructorIds: remote.instructor_slugs,
              };
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);
        },
        local.classes,
      ),
    instructors: () =>
      safe(
        "instructors",
        async () => {
          const { data, error } = await api.GET("/v1/instructors");
          if (error || !data) throw new Error("request failed");
          const bySlug = new Map(data.map((i) => [i.slug, i]));
          return local.instructors
            .filter((i) => bySlug.has(i.slug))
            .map((i) => {
              const remote = bySlug.get(i.slug)!;
              return {
                ...i,
                name: remote.name,
                role: remote.role,
                specialties: remote.specialties,
              };
            });
        },
        local.instructors,
      ),
    testimonials: () => localSource.testimonials(),
    events: () => localSource.events(),
    gallery: () => localSource.gallery(),
  };
}

export function getContentSource(): ContentSource {
  const mode = process.env.CONTENT_SOURCE ?? "local";
  if (mode === "api") {
    return apiSource(process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "");
  }
  return localSource;
}

/** Raw local data, used by the content export script for database seeding. */
export const localContent = local;
