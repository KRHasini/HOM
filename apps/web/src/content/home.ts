/**
 * Home page copy. Headline, signature and closing lines come from the studio's posters.
 * Trust items with `verified: false` are hidden in production until confirmed.
 */
import type { z } from "zod";

import { navigation } from "./navigation";
import type { HomeSchema } from "./schema";
import { site } from "./site.config";

type HomeInput = z.input<typeof HomeSchema>;

export const home = {
  seo: {
    title: site.seo.defaultTitle,
    description: site.seo.description,
  },
  hero: {
    eyebrow: "Dance & fitness studio",
    headline: site.taglineWords,
    signature: site.signature,
    primaryCta: { label: "Book a Free Trial", href: navigation.cta.trial.href },
    secondaryCta: navigation.cta.classes,
    scrollCue: "Scroll",
    video: {
      src: "/media/hero/hero.mp4",
      webm: "/media/hero/hero.webm",
      poster: "/media/hero/hero-poster.jpg",
      alt: "A dancer moves through stage haze in warm golden light",
      width: 1920,
      height: 1080,
      motif: "stage",
      stock: true, // TODO(confirm): replace with studio footage (see public/media/README.md)
    },
  },
  trust: {
    items: [
      { label: "Founder-led studio", verified: true },
      { label: "{classCount} dance & fitness styles", verified: true }, // {classCount} is filled from classes.ts
      { label: "Free trial class", verified: true },
      { label: "Kids, teens & adults", verified: false }, // TODO(confirm)
      { label: "Beginner friendly", verified: false }, // TODO(confirm)
    ],
  },
  about: {
    eyebrow: "The studio",
    title: "A house built for every kind of mover",
    body: [
      // TODO(confirm): placeholder copy
      "House of Movements is a home for dancers, athletes and first-timers alike — a place where classical tradition and street energy share the same floor.",
      "Led by founder Vignesh K, every class is built on the same promise: move with intention, express without fear, and transform a little more each week.",
    ],
    link: { label: "Our story", href: "/about" },
  },
  showcase: {
    eyebrow: "Eight disciplines",
    title: "Find your movement",
    intro: "From temple-born classical to street-born grooves — choose the style that moves you.",
    cta: { label: "View all classes", href: "/classes" },
    exploreLabel: "Explore",
  },
  pillars: {
    eyebrow: "Why HOM",
    title: "Four things we teach in every class",
    intro: "Drawn from the values of classical training and carried into every style we teach.",
    items: [
      {
        title: "Tradition",
        text: "Respect for where each style comes from — its history, music and culture.",
        icon: "tradition",
      },
      {
        title: "Technique",
        text: "Clean foundations, posture and precision, taught progressively and safely.",
        icon: "technique",
      },
      {
        title: "Confidence",
        text: "Expression and stage presence that students carry far beyond the studio.",
        icon: "confidence",
      },
      {
        title: "Discipline",
        text: "Commitment, focus and grace — the habits that turn practice into progress.",
        icon: "discipline",
      },
    ],
  },
  founder: {
    eyebrow: "Founder & lead instructor",
    title: site.owner.name,
    quote:
      "Everyone can move. My job is to help you move with intention — and to love every minute of it.", // TODO(confirm): founder's own words
    cta: { label: "Meet the instructors", href: "/instructors" },
  },
  stats: {
    eyebrow: "In numbers",
    title: "The movement so far",
  },
  gallery: {
    eyebrow: "Moments",
    title: "Inside the movement",
    cta: { label: "Open the gallery", href: "/gallery" },
  },
  testimonials: {
    eyebrow: "Stories",
    title: "In their words",
    cta: { label: "Read more stories", href: "/testimonials" },
  },
  events: {
    eyebrow: "What's on",
    title: "Events & announcements",
    cta: { label: "All events", href: "/events" },
    empty: {
      title: "Stay tuned",
      text: "Showcases, workshops and performances are on the way. Follow us on Instagram to hear first.",
    },
  },
  trial: {
    eyebrow: "Your first class is on us",
    title: "Book a free trial",
    intro: site.callToAction,
    formTitle: "Reserve your spot",
  },
  faq: {
    eyebrow: "Good to know",
    title: "Questions, answered",
    ids: ["trial-what-happens", "age-groups-beginners", "what-to-wear", "fees-how-much"],
    cta: { label: "All FAQs", href: "/faq" },
  },
  contact: {
    title: "Come move with us",
    text: "Call, WhatsApp or drop by — we would love to meet you.",
  },
} satisfies HomeInput;
