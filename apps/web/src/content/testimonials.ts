/**
 * Student and parent stories. Every entry below is a PLACEHOLDER (placeholder: true):
 * they render in development so the layout can be reviewed, and the testimonials
 * section, page and nav link hide themselves automatically in production until at
 * least one real entry (placeholder: false) exists.
 */
import type { z } from "zod";

import type { TestimonialSchema } from "./schema";

type TestimonialInput = z.input<typeof TestimonialSchema>;

export const testimonials = [
  {
    id: "placeholder-parent-bharatanatyam",
    quote:
      "Placeholder testimonial — a parent's words about their child's first year of Bharatanatyam will appear here.",
    name: "Parent name",
    relation: "parent",
    classSlug: "bharatanatyam",
    placeholder: true, // TODO(confirm): replace with a real, consented testimonial
    sortOrder: 1,
  },
  {
    id: "placeholder-student-hip-hop",
    quote:
      "Placeholder testimonial — a student's story about finding confidence through Hip-Hop will appear here.",
    name: "Student name",
    relation: "student",
    classSlug: "western-hip-hop",
    placeholder: true, // TODO(confirm)
    sortOrder: 2,
  },
  {
    id: "placeholder-student-yoga",
    quote:
      "Placeholder testimonial — a student's reflection on how yoga changed their week will appear here.",
    name: "Student name",
    relation: "student",
    classSlug: "yoga",
    placeholder: true, // TODO(confirm)
    sortOrder: 3,
  },
  {
    id: "placeholder-student-zumba",
    quote:
      "Placeholder testimonial — a Zumba regular's words about the energy of the room will appear here.",
    name: "Student name",
    relation: "student",
    classSlug: "zumba",
    placeholder: true, // TODO(confirm)
    sortOrder: 4,
  },
] satisfies TestimonialInput[];
