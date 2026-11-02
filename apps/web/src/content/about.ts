/**
 * About page copy. Story, values and founder note are on-brand placeholder copy —
 * TODO(confirm) with the owner. Timeline items flagged `placeholder` are hidden in
 * production.
 */
import type { z } from "zod";

import type { AboutSchema } from "./schema";
import { site } from "./site.config";

type AboutInput = z.input<typeof AboutSchema>;

export const about = {
  seo: {
    title: "About",
    description: `${site.name} is a founder-led dance and fitness studio. ${site.signature}.`,
  },
  hero: {
    eyebrow: "About the studio",
    title: site.signature,
    intro: "A founder-led studio for dance, fitness and the confidence that grows between them.",
    image: {
      src: "/media/about/studio-3.jpg",
      alt: "Dancer in a flowing dress lit by warm stage light",
      focal: "60% 40%",
      motif: "stage",
      stock: true,
    },
  },
  story: {
    eyebrow: "Our story",
    title: "Built for every kind of mover",
    paragraphs: [
      // TODO(confirm): placeholder story
      "House of Movements began with a simple idea from founder Vignesh K: a studio where a child's first step and a performer's hundredth show are treated with the same care.",
      "Today the studio brings together eight disciplines under one roof — classical Bharatanatyam, Contemporary, Bollywood, Western Hip-Hop, Free Style, Gymnastics, Yoga and Zumba — each taught with patience, precision and a lot of joy.",
      "Whatever brings you through the door — fitness, culture, confidence or the stage — you will find a place to grow here.",
    ],
  },
  philosophy: {
    eyebrow: "Philosophy",
    title: "Move. Express. Transform.",
    words: [
      {
        word: "Move",
        text: "Every journey starts with the body. We build strong, safe foundations first.",
      },
      {
        word: "Express",
        text: "Technique gives you a voice. We help you find what you want to say with it.",
      },
      {
        word: "Transform",
        text: "Practice changes more than your dancing — it changes how you carry yourself.",
      },
    ],
  },
  space: {
    eyebrow: "The space",
    title: "A room made for movement",
    text: "Sprung floors, full-length mirrors and room to fly — a studio designed for focus and freedom.", // TODO(confirm) studio features
    images: [
      {
        src: "/media/about/studio-1.jpg",
        alt: "Warm wooden studio floor with mirrors",
        motif: "stage",
        stock: true,
      },
      {
        src: "/media/about/studio-2.jpg",
        alt: "Dancers practising at the barre",
        motif: "stage",
        stock: true,
      },
    ],
  },
  values: {
    eyebrow: "Values",
    title: "What we stand for",
    items: [
      {
        title: "Every body welcome",
        text: "No auditions to start. Beginners are celebrated here.",
      },
      {
        title: "Craft matters",
        text: "We care about doing things properly — technique, safety and musicality.",
      },
      { title: "Joy is the point", text: "Discipline and fun belong in the same class." },
      { title: "Community", text: "Students cheer each other on, on stage and off." },
    ],
  },
  founderNote: {
    eyebrow: "A note from the founder",
    title: "Why I built HOM",
    quote: [
      // TODO(confirm): founder's own words
      "I wanted a studio where anyone could walk in, however unsure, and walk out a little braver.",
      "Movement gave me my voice. House of Movements is my way of passing that on.",
    ],
    signoff: site.owner.name,
  },
  timeline: {
    eyebrow: "Milestones",
    title: "The journey so far",
    items: [
      {
        label: "Year",
        title: "The studio opens",
        text: "House of Movements opens its doors.",
        placeholder: true,
      }, // TODO(confirm)
      {
        label: "Year",
        title: "First showcase",
        text: "Students take the stage together.",
        placeholder: true,
      }, // TODO(confirm)
      {
        label: "Today",
        title: "Eight disciplines",
        text: "Dance, fitness and classical training under one roof.",
        placeholder: false,
      },
    ],
  },
} satisfies AboutInput;
