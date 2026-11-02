/**
 * Zod schemas for every editable content file. Content is parsed once at build time
 * (content/index.ts) so a typo or missing field fails the build instead of the site.
 */
import { z } from "zod";

export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-kebab-case");
export const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color");
export const publicPath = z
  .string()
  .regex(/^\/(media|brand)\//, "Paths start with /media/ or /brand/");
export const internalHref = z.string().regex(/^\/[^/]?/, "Internal links start with /");

/** Original vector motifs used by MediaPlaceholder when real media is missing. */
export const motifIds = [
  "leap",
  "arabesque",
  "mudra",
  "groove",
  "twirl",
  "balance",
  "burst",
  "flow",
  "lotus",
  "portrait",
  "stage",
] as const;
export const MotifSchema = z.enum(motifIds);
export type MotifId = z.infer<typeof MotifSchema>;

// ------------------------------------------------------------------- media

export const ImageRefSchema = z.object({
  src: publicPath,
  alt: z.string().min(1),
  /** Intrinsic size; read automatically from the media manifest when omitted. */
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  /** CSS object-position, e.g. "50% 30%". */
  focal: z.string().optional(),
  /** Placeholder art used until a real file exists at `src`. */
  motif: MotifSchema.default("stage"),
  /** Licensed stock photo standing in for the studio's own photography. TODO(confirm). */
  stock: z.boolean().default(false),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const VideoRefSchema = z.object({
  src: publicPath,
  webm: publicPath.optional(),
  poster: publicPath,
  alt: z.string().min(1),
  captions: publicPath.optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  motif: MotifSchema.default("stage"),
  stock: z.boolean().default(false),
});
export type VideoRef = z.infer<typeof VideoRefSchema>;

// ------------------------------------------------------------------- site

const LinkSchema = z.object({ label: z.string(), href: z.string() });
export type Link = z.infer<typeof LinkSchema>;

export const SiteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  taglineWords: z.array(z.string()).min(1),
  signature: z.string(),
  closing: z.string(),
  callToAction: z.string(),
  description: z.string(),
  url: z.url(),
  locale: z.string(),
  language: z.string(),
  phone: z.object({ display: z.string(), e164: z.string().regex(/^\+\d{8,15}$/) }),
  whatsapp: z.object({ number: z.string().regex(/^\d{8,15}$/), prefill: z.string() }),
  email: z.email(),
  address: z.object({
    line: z.string(),
    locality: z.string(),
    city: z.string(),
    region: z.string(),
    pincode: z.string(),
    country: z.string(),
    countryCode: z.string().length(2),
  }),
  geo: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  mapLink: z.url(),
  mapEmbedUrl: z.url().nullable(),
  hours: z.array(z.object({ days: z.string(), time: z.string(), placeholder: z.boolean() })),
  social: z.object({ instagram: z.url().optional(), youtube: z.url().optional() }),
  socialHandles: z.object({ instagram: z.string().optional(), youtube: z.string().optional() }),
  owner: z.object({ name: z.string(), role: z.string(), instructorId: slug }),
  seo: z.object({
    titleTemplate: z.string(),
    defaultTitle: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    twitterHandle: z.string().optional(),
  }),
  analytics: z.object({ gaMeasurementId: z.string(), requireConsent: z.boolean() }),
  features: z.object({
    showPrices: z.boolean(),
    showStats: z.boolean(),
    turnstile: z.boolean(),
    customCursor: z.boolean(),
    smoothScroll: z.boolean(),
    pageTransitions: z.boolean(),
  }),
  trial: z.object({
    responseTime: z.string(),
    nextSteps: z.array(z.string()).min(1),
  }),
});
export type Site = z.infer<typeof SiteSchema>;

// -------------------------------------------------------------- navigation

export const NavigationSchema = z.object({
  header: z.array(LinkSchema),
  footer: z.array(z.object({ title: z.string(), links: z.array(LinkSchema) })),
  legal: z.array(LinkSchema),
  cta: z.object({
    trial: LinkSchema,
    classes: LinkSchema,
    contact: LinkSchema,
  }),
  actionBar: z.object({ call: z.string(), whatsapp: z.string(), trial: z.string() }),
  menuLabel: z.object({ open: z.string(), close: z.string() }),
  skipLink: z.string(),
});
export type Navigation = z.infer<typeof NavigationSchema>;

// ----------------------------------------------------------------- classes

export const categories = ["dance", "fitness", "traditional"] as const;
export const audiences = ["kids", "teens", "adults"] as const;
export const treatments = [
  "default",
  "monochrome",
  "warm-serif",
  "calm-cream",
  "energetic",
] as const;

const TitledTextSchema = z.object({ title: z.string(), text: z.string() });

export const ClassSchema = z.object({
  slug,
  name: z.string(),
  tagline: z.string(),
  summary: z.string().max(220),
  description: z.array(z.string()).min(1),
  category: z.enum(categories),
  audiences: z.array(z.enum(audiences)).min(1),
  level: z.string(),
  durationMinutes: z.number().int().positive().nullable(),
  schedule: z.object({
    placeholder: z.boolean(),
    slots: z.array(z.object({ days: z.string(), time: z.string(), batch: z.string().optional() })),
  }),
  priceText: z.string(),
  accent: hexColor,
  accentContrast: hexColor,
  accentOnDark: hexColor,
  treatment: z.enum(treatments),
  motif: MotifSchema,
  benefits: z.array(TitledTextSchema).min(3),
  whoFor: z.array(z.string()).min(2),
  expect: z.array(TitledTextSchema).length(3),
  cover: ImageRefSchema,
  gallery: z.array(ImageRefSchema),
  faqIds: z.array(z.string()),
  instructorIds: z.array(slug),
  keywords: z.array(z.string()),
  sortOrder: z.number().int(),
});
export type DanceClass = z.infer<typeof ClassSchema>;
export type ClassCategory = (typeof categories)[number];
export type Audience = (typeof audiences)[number];
export type Treatment = (typeof treatments)[number];

// ------------------------------------------------------------- instructors

export const InstructorSchema = z.object({
  slug,
  name: z.string(),
  role: z.string(),
  shortBio: z.string(),
  bio: z.array(z.string()).min(1),
  philosophy: z.string().optional(),
  specialties: z.array(z.string()),
  experience: z.string().nullable(),
  achievements: z.array(z.object({ text: z.string(), placeholder: z.boolean() })),
  social: z.object({ instagram: z.url().optional(), youtube: z.url().optional() }),
  photo: ImageRefSchema,
  featured: z.boolean(),
  placeholder: z.boolean(),
  sortOrder: z.number().int(),
});
export type Instructor = z.infer<typeof InstructorSchema>;

// ------------------------------------------------------------ testimonials

export const TestimonialSchema = z.object({
  id: slug,
  quote: z.string(),
  name: z.string(),
  relation: z.enum(["student", "parent"]),
  classSlug: slug.optional(),
  photo: ImageRefSchema.optional(),
  video: VideoRefSchema.optional(),
  placeholder: z.boolean(),
  sortOrder: z.number().int(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

// ----------------------------------------------------------------- gallery

export const galleryCategories = ["classes", "performances", "events", "studio"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export const GalleryItemSchema = z.discriminatedUnion("kind", [
  z.object({
    id: slug,
    kind: z.literal("image"),
    category: z.enum(galleryCategories),
    caption: z.string(),
    media: ImageRefSchema,
  }),
  z.object({
    id: slug,
    kind: z.literal("video"),
    category: z.enum(galleryCategories),
    caption: z.string(),
    media: VideoRefSchema,
  }),
]);
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

export const GallerySchema = z.object({
  categories: z.array(z.object({ id: z.enum(galleryCategories), label: z.string() })),
  items: z.array(GalleryItemSchema),
  youtube: z.object({
    title: z.string(),
    text: z.string(),
    /** YouTube video ids to feature; leave empty to show only the channel link. */
    featuredVideoIds: z.array(z.string()),
  }),
});
export type Gallery = z.infer<typeof GallerySchema>;

// ------------------------------------------------------------------ events

export const EventSchema = z.object({
  id: slug,
  title: z.string(),
  startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }).optional(),
  venue: z.string(),
  description: z.string(),
  image: ImageRefSchema.optional(),
  registrationUrl: z.url().optional(),
  status: z.enum(["scheduled", "cancelled", "postponed"]),
  placeholder: z.boolean(),
});
export type StudioEvent = z.infer<typeof EventSchema>;

// -------------------------------------------------------------------- faqs

export const FaqItemSchema = z.object({ id: slug, question: z.string(), answer: z.string() });
export type FaqItem = z.infer<typeof FaqItemSchema>;
export const FaqGroupSchema = z.object({
  id: slug,
  title: z.string(),
  items: z.array(FaqItemSchema),
});
export type FaqGroup = z.infer<typeof FaqGroupSchema>;

// ------------------------------------------------------------------- stats

export const StatSchema = z.object({
  id: slug,
  label: z.string(),
  value: z.number().nonnegative(),
  suffix: z.string().default(""),
  /** Only real, verified numbers may be visible. */
  visible: z.boolean(),
});
export type Stat = z.infer<typeof StatSchema>;

// ------------------------------------------------------------- page copy

const SectionIntroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string().optional(),
});
export type SectionIntro = z.infer<typeof SectionIntroSchema>;

export const PageMetaSchema = z.object({
  seo: z.object({ title: z.string(), description: z.string() }),
  hero: SectionIntroSchema,
});
export type PageMeta = z.infer<typeof PageMetaSchema>;

export const HomeSchema = z.object({
  seo: z.object({ title: z.string(), description: z.string() }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.array(z.string()).min(1),
    signature: z.string(),
    primaryCta: LinkSchema,
    secondaryCta: LinkSchema,
    scrollCue: z.string(),
    video: VideoRefSchema,
  }),
  trust: z.object({
    items: z.array(z.object({ label: z.string(), verified: z.boolean() })),
  }),
  about: SectionIntroSchema.extend({ body: z.array(z.string()), link: LinkSchema }),
  showcase: SectionIntroSchema.extend({ cta: LinkSchema, exploreLabel: z.string() }),
  pillars: SectionIntroSchema.extend({
    items: z.array(
      z.object({
        title: z.string(),
        text: z.string(),
        icon: z.enum(["tradition", "technique", "confidence", "discipline"]),
      }),
    ),
  }),
  founder: SectionIntroSchema.extend({ quote: z.string(), cta: LinkSchema }),
  stats: SectionIntroSchema,
  gallery: SectionIntroSchema.extend({ cta: LinkSchema }),
  testimonials: SectionIntroSchema.extend({ cta: LinkSchema }),
  events: SectionIntroSchema.extend({
    cta: LinkSchema,
    empty: z.object({ title: z.string(), text: z.string() }),
  }),
  trial: SectionIntroSchema.extend({ formTitle: z.string() }),
  faq: SectionIntroSchema.extend({ ids: z.array(slug), cta: LinkSchema }),
  contact: z.object({ title: z.string(), text: z.string() }),
});
export type Home = z.infer<typeof HomeSchema>;

export const AboutSchema = z.object({
  seo: z.object({ title: z.string(), description: z.string() }),
  hero: SectionIntroSchema.extend({ image: ImageRefSchema }),
  story: SectionIntroSchema.extend({ paragraphs: z.array(z.string()) }),
  philosophy: SectionIntroSchema.extend({
    words: z.array(z.object({ word: z.string(), text: z.string() })).length(3),
  }),
  space: SectionIntroSchema.extend({ text: z.string(), images: z.array(ImageRefSchema) }),
  values: SectionIntroSchema.extend({ items: z.array(TitledTextSchema) }),
  founderNote: SectionIntroSchema.extend({ quote: z.array(z.string()), signoff: z.string() }),
  timeline: SectionIntroSchema.extend({
    items: z.array(
      z.object({
        label: z.string(),
        title: z.string(),
        text: z.string(),
        placeholder: z.boolean(),
      }),
    ),
  }),
});
export type About = z.infer<typeof AboutSchema>;

const LegalDocSchema = z.object({
  title: z.string(),
  updated: z.string(),
  placeholder: z.boolean(),
  intro: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.array(z.string()) })),
});
export type LegalDoc = z.infer<typeof LegalDocSchema>;

export const LegalSchema = z.object({
  privacy: LegalDocSchema,
  terms: LegalDocSchema,
  registration: z.object({ text: z.string(), visible: z.boolean() }),
  draftNotice: z.string(),
  updatedLabel: z.string(),
  formConsent: z.string(),
  cookie: z.object({ text: z.string(), accept: z.string(), decline: z.string() }),
});
export type Legal = z.infer<typeof LegalSchema>;

export const PagesSchema = z.object({
  classes: PageMetaSchema,
  instructors: PageMetaSchema,
  gallery: PageMetaSchema,
  events: PageMetaSchema,
  testimonials: PageMetaSchema,
  contact: PageMetaSchema,
  trial: PageMetaSchema,
  faq: PageMetaSchema,
  privacy: PageMetaSchema,
  terms: PageMetaSchema,
});
export type Pages = z.infer<typeof PagesSchema>;
export type PageKey = keyof Pages;

export const UiCopySchema = z.object({
  notFound: z.object({ eyebrow: z.string(), title: z.string(), text: z.string(), cta: LinkSchema }),
  error: z.object({ eyebrow: z.string(), title: z.string(), text: z.string(), retry: z.string() }),
  classes: z.object({
    filterLabel: z.string(),
    allLabel: z.string(),
    categoryLabels: z.record(z.enum(categories), z.string()),
    audienceLabels: z.record(z.enum(audiences), z.string()),
    emptyState: z.string(),
    durationUnit: z.string(),
    scheduleFallback: z.string(),
    detail: z.object({
      about: z.string(),
      benefits: z.string(),
      whoFor: z.string(),
      expect: z.string(),
      schedule: z.string(),
      instructor: z.string(),
      gallery: z.string(),
      faq: z.string(),
      related: z.string(),
      book: z.string(),
      fees: z.string(),
      feesOnRequest: z.string(),
      scheduleColumns: z.object({ days: z.string(), time: z.string(), batch: z.string() }),
      facts: z.object({
        category: z.string(),
        audience: z.string(),
        level: z.string(),
        duration: z.string(),
      }),
      /** Headings; "{class}" is replaced with the class name. */
      titles: z.object({
        benefits: z.string(),
        whoFor: z.string(),
        expect: z.string(),
        faq: z.string(),
        related: z.string(),
      }),
    }),
  }),
  testimonials: z.object({
    relationLabels: z.record(z.enum(["student", "parent"]), z.string()),
    filterAll: z.string(),
    previous: z.string(),
    next: z.string(),
    empty: z.string(),
  }),
  events: z.object({
    upcoming: z.string(),
    past: z.string(),
    register: z.string(),
    enquire: z.string(),
    emptyTitle: z.string(),
    emptyText: z.string(),
    followCta: z.string(),
    statusLabels: z.record(z.enum(["scheduled", "cancelled", "postponed"]), z.string()),
  }),
  gallery: z.object({
    all: z.string(),
    play: z.string(),
    view: z.string(),
    close: z.string(),
    previous: z.string(),
    next: z.string(),
    youtubeCta: z.string(),
    loadVideo: z.string(),
  }),
  contact: z.object({
    detailsTitle: z.string(),
    phone: z.string(),
    whatsapp: z.string(),
    whatsappCta: z.string(),
    email: z.string(),
    address: z.string(),
    hours: z.string(),
    social: z.string(),
    mapTitle: z.string(),
    mapLoad: z.string(),
    directions: z.string(),
    formTitle: z.string(),
  }),
  instructors: z.object({
    founderEyebrow: z.string(),
    philosophy: z.string(),
    specialties: z.string(),
    achievements: z.string(),
    experience: z.string(),
    teaches: z.string(),
    team: z.string(),
  }),
  forms: z.object({
    required: z.string(),
    optional: z.string(),
    submit: z.string(),
    submitting: z.string(),
    success: z.string(),
    genericError: z.string(),
    networkError: z.string(),
    rateLimited: z.string(),
  }),
});
export type UiCopy = z.infer<typeof UiCopySchema>;

const OptionSchema = z.object({ value: z.string(), label: z.string() });

export const FormsCopySchema = z.object({
  fields: z.object({
    name: z.string(),
    phone: z.string(),
    phoneHint: z.string(),
    email: z.string(),
    message: z.string(),
    classInterest: z.string(),
    classPlaceholder: z.string(),
    age: z.string(),
    ageHintSelf: z.string(),
    ageHintChild: z.string(),
  }),
  links: z.object({ privacy: z.string(), whatsapp: z.string() }),
  quickTrial: z.object({ submit: z.string(), fullFormLink: z.string() }),
  contact: z.object({ submit: z.string(), successTitle: z.string(), successText: z.string() }),
  trial: z.object({
    steps: z.array(z.object({ title: z.string(), description: z.string() })).length(3),
    audienceQuestion: z.string(),
    audienceOptions: z.array(
      OptionSchema.extend({ value: z.enum(["self", "child"]), hint: z.string() }),
    ),
    daysQuestion: z.string(),
    dayOptions: z.array(
      OptionSchema.extend({ value: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) }),
    ),
    timeQuestion: z.string(),
    timeOptions: z.array(
      OptionSchema.extend({
        value: z.enum(["morning", "afternoon", "evening", "weekend", "flexible"]),
      }),
    ),
    back: z.string(),
    next: z.string(),
    submit: z.string(),
    stepLabel: z.string(),
    success: z.object({
      eyebrow: z.string(),
      title: z.string(),
      summaryTitle: z.string(),
      nextStepsTitle: z.string(),
      whatsappCta: z.string(),
      homeCta: z.string(),
      summaryLabels: z.object({
        for: z.string(),
        class: z.string(),
        days: z.string(),
        time: z.string(),
        phone: z.string(),
      }),
    }),
  }),
});
export type FormsCopy = z.infer<typeof FormsCopySchema>;
