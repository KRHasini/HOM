/**
 * Instructors. Vignesh K (founder and lead instructor) is confirmed; his bio copy is
 * an on-brand placeholder to be confirmed. Entries with `placeholder: true` are shown
 * in development only and hidden automatically in production.
 *
 * Photos: drop a portrait at the `photo.src` path (portrait 4:5, ≥1600px tall) and it
 * replaces the duotone silhouette automatically.
 */
import type { z } from "zod";

import { site } from "./site.config";
import type { InstructorSchema } from "./schema";

type InstructorInput = z.input<typeof InstructorSchema>;

export const instructors = [
  {
    slug: "vignesh-k",
    name: "Vignesh K",
    role: "Founder and Lead Instructor",
    shortBio:
      "Vignesh K founded House of Movements to give every student — first-timer or performer — a place where passion becomes movement.",
    bio: [
      // TODO(confirm): placeholder biography — replace with Vignesh's own story.
      "Vignesh K founded House of Movements with a simple belief: everyone can move, and everyone deserves a space that helps them move with confidence.",
      "As the studio's lead instructor, he guides the teaching across every style on the timetable — from classical foundations to street grooves and fitness — so each class shares the same care for technique, musicality and expression.",
      "His classes are known for their warmth and their standards in equal measure: patient with beginners, demanding of potential, and always focused on the joy of dancing.",
    ],
    philosophy:
      "Move with intention, express without fear and let the practice transform you — one class at a time.",
    specialties: ["Choreography", "Performance coaching", "Multi-style training"], // TODO(confirm)
    experience: null, // TODO(confirm): e.g. "15+ years teaching and performing"
    achievements: [
      {
        text: "Achievements, awards and notable performances — to be confirmed",
        placeholder: true,
      },
      { text: "Training lineage and certifications — to be confirmed", placeholder: true },
    ],
    social: { instagram: site.social.instagram, youtube: site.social.youtube },
    photo: {
      src: "/media/instructors/vignesh-k.jpg",
      alt: "Portrait of Vignesh K, founder and lead instructor of House of Movements",
      motif: "portrait",
    },
    featured: true,
    placeholder: false,
    sortOrder: 0,
  },
  {
    slug: "instructor-tba-dance",
    name: "Dance Instructor",
    role: "Hip-Hop & Bollywood", // TODO(confirm)
    shortBio: "Instructor profile to be announced.",
    bio: ["Instructor profile to be announced."],
    specialties: ["Hip-Hop", "Bollywood"],
    experience: null,
    achievements: [],
    social: {},
    photo: {
      src: "/media/instructors/instructor-tba-dance.jpg",
      alt: "Portrait placeholder for a House of Movements dance instructor",
      motif: "portrait",
    },
    featured: false,
    placeholder: true,
    sortOrder: 1,
  },
  {
    slug: "instructor-tba-fitness",
    name: "Fitness Instructor",
    role: "Yoga, Zumba & Gymnastics", // TODO(confirm)
    shortBio: "Instructor profile to be announced.",
    bio: ["Instructor profile to be announced."],
    specialties: ["Yoga", "Zumba", "Gymnastics"],
    experience: null,
    achievements: [],
    social: {},
    photo: {
      src: "/media/instructors/instructor-tba-fitness.jpg",
      alt: "Portrait placeholder for a House of Movements fitness instructor",
      motif: "portrait",
    },
    featured: false,
    placeholder: true,
    sortOrder: 2,
  },
] satisfies InstructorInput[];
