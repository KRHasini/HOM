import type { z } from "zod";

import type { NavigationSchema } from "./schema";

export const navigation = {
  header: [
    { label: "Classes", href: "/classes" },
    { label: "Instructors", href: "/instructors" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    {
      title: "Studio",
      links: [
        { label: "About", href: "/about" },
        { label: "Instructors", href: "/instructors" },
        { label: "Gallery", href: "/gallery" },
        { label: "Events", href: "/events" },
        { label: "Testimonials", href: "/testimonials" },
      ],
    },
    {
      title: "Classes",
      links: [
        { label: "All classes", href: "/classes" },
        { label: "Bharatanatyam", href: "/classes/bharatanatyam" },
        { label: "Western Hip-Hop", href: "/classes/western-hip-hop" },
        { label: "Bollywood", href: "/classes/bollywood" },
        { label: "Yoga", href: "/classes/yoga" },
      ],
    },
    {
      title: "Visit",
      links: [
        { label: "Book a free trial", href: "/trial" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  cta: {
    trial: { label: "Book Free Trial", href: "/trial" },
    classes: { label: "Explore Classes", href: "/classes" },
    contact: { label: "Contact us", href: "/contact" },
  },
  actionBar: { call: "Call", whatsapp: "WhatsApp", trial: "Book Trial" },
  menuLabel: { open: "Open menu", close: "Close menu" },
  skipLink: "Skip to content",
} satisfies z.input<typeof NavigationSchema>;
