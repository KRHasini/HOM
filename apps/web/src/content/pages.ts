/** SEO metadata and hero copy for the remaining routes. */
import type { z } from "zod";

import type { PagesSchema } from "./schema";
import { site } from "./site.config";

type PagesInput = z.input<typeof PagesSchema>;

export const pages = {
  classes: {
    seo: {
      title: "Classes",
      description:
        "Western Hip-Hop, Free Style, Contemporary, Bollywood, Bharatanatyam, Gymnastics, Yoga and Zumba — classes for kids, teens and adults.",
    },
    hero: {
      eyebrow: "Eight disciplines",
      title: "Classes",
      intro: "Classical, street, cinematic and fitness — find the movement that fits you.",
    },
  },
  instructors: {
    seo: {
      title: "Instructors",
      description: `Meet ${site.owner.name}, founder and lead instructor of ${site.name}, and the team.`,
    },
    hero: {
      eyebrow: "The team",
      title: "Instructors",
      intro: "Teachers who care about technique, musicality — and you.",
    },
  },
  gallery: {
    seo: {
      title: "Gallery",
      description: `Classes, performances, events and the studio — moments from ${site.name}.`,
    },
    hero: {
      eyebrow: "Moments",
      title: "Gallery",
      intro: "Classes, performances and life at the studio.",
    },
  },
  events: {
    seo: {
      title: "Events",
      description: `Showcases, workshops and announcements from ${site.name}.`,
    },
    hero: { eyebrow: "What's on", title: "Events", intro: "Showcases, workshops and studio news." },
  },
  testimonials: {
    seo: {
      title: "Testimonials",
      description: `Stories from students and parents at ${site.name}.`,
    },
    hero: {
      eyebrow: "Stories",
      title: "Testimonials",
      intro: "Students and parents, in their own words.",
    },
  },
  contact: {
    seo: {
      title: "Contact",
      description: `Call, WhatsApp or visit ${site.name}. Enquire about classes, batches and free trials.`,
    },
    hero: {
      eyebrow: "Get in touch",
      title: "Contact",
      intro: "Questions about classes, batches or trials? We usually reply the same day.",
    },
  },
  trial: {
    seo: {
      title: "Book a Free Trial",
      description: `Book a free trial class at ${site.name} — it takes under a minute.`,
    },
    hero: {
      eyebrow: "Your first class is on us",
      title: "Free trial",
      intro: "Three quick steps and we will take it from there.",
    },
  },
  faq: {
    seo: {
      title: "FAQ",
      description: `Age groups, what to wear, trial classes, fees and batches at ${site.name}.`,
    },
    hero: {
      eyebrow: "Good to know",
      title: "FAQ",
      intro: "Everything you need before your first class.",
    },
  },
  privacy: {
    seo: { title: "Privacy Policy", description: `How ${site.name} handles your personal data.` },
    hero: { eyebrow: "Legal", title: "Privacy" },
  },
  terms: {
    seo: { title: "Terms", description: `Terms of use for the ${site.name} website and classes.` },
    hero: { eyebrow: "Legal", title: "Terms" },
  },
} satisfies PagesInput;
