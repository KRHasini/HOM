/**
 * Studio facts, contact details, SEO defaults and feature flags.
 * Change a value here and it updates everywhere on the site.
 *
 * Values marked TODO(confirm) are placeholders the owner must replace before launch.
 */
import type { z } from "zod";

import type { SiteSchema } from "./schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "House of Movements",
  shortName: "HOM",
  legalName: "House of Movements", // TODO(confirm): registered business name
  tagline: "Move . Express . Transform",
  taglineWords: ["Move.", "Express.", "Transform."],
  signature: "Where Passion Becomes Movement",
  closing: "Join the movement. Be the change.",
  callToAction: "Enroll today and let your movements inspire.",
  description:
    "House of Movements is a dance and fitness studio led by founder Vignesh K — Western Hip-Hop, Free Style, Contemporary, Bollywood, Bharatanatyam, Gymnastics, Yoga and Zumba for every age.",
  url: siteUrl,
  locale: "en_IN",
  language: "en-IN",

  phone: { display: "97425 08862", e164: "+919742508862" },
  whatsapp: {
    number: "919742508862",
    prefill: "Hi HOM, I would like to book a free trial class.",
  },
  email: "hello@houseofmovements.in", // TODO(confirm)

  address: {
    line: "Address line", // TODO(confirm)
    locality: "Locality", // TODO(confirm)
    city: "City", // TODO(confirm)
    region: "State", // TODO(confirm)
    pincode: "000000", // TODO(confirm)
    country: "India",
    countryCode: "IN",
  },
  geo: null, // TODO(confirm): { lat: 12.97, lng: 77.59 } — enables geo in JSON-LD
  mapLink: "https://maps.app.goo.gl/zbzDhYY7fMXJLAPo6",
  // TODO(confirm): paste the "Embed a map" src from Google Maps to show an inline map.
  mapEmbedUrl: null,

  hours: [{ days: "Mon – Sat", time: "Timings shared on enquiry", placeholder: true }], // TODO(confirm)

  social: {
    instagram: "https://www.instagram.com/houseofmovements.in", // TODO(confirm handle)
    youtube: "https://youtube.com/@houseofmovements",
  },
  socialHandles: { instagram: "@houseofmovements.in", youtube: "@houseofmovements" },

  owner: { name: "Vignesh K", role: "Founder and Lead Instructor", instructorId: "vignesh-k" },

  seo: {
    titleTemplate: "%s · House of Movements",
    defaultTitle: "House of Movements — Dance & Fitness Studio",
    description:
      "Dance and fitness classes for kids, teens and adults: Hip-Hop, Contemporary, Bollywood, Bharatanatyam, Free Style, Gymnastics, Yoga and Zumba. Book a free trial class.",
    keywords: [
      "dance classes",
      "dance studio",
      "Bharatanatyam classes",
      "Hip-Hop dance classes",
      "Bollywood dance classes",
      "Contemporary dance",
      "Zumba classes",
      "Yoga classes",
      "Gymnastics for kids",
      "House of Movements",
    ],
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    requireConsent: true,
  },

  features: {
    showPrices: false,
    showStats: false,
    turnstile: process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true",
    customCursor: true,
    smoothScroll: true,
    pageTransitions: true,
  },

  trial: {
    responseTime: "We will call you within 24 hours.", // TODO(confirm) response promise
    nextSteps: [
      "We will call you within 24 hours to understand your goals.",
      "We match you with the right batch and confirm a trial slot.",
      "Arrive 10 minutes early in comfortable clothes — and just move.",
    ],
  },
} satisfies z.input<typeof SiteSchema>;
