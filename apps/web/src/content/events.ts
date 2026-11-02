/**
 * Events and announcements. The entries below are PLACEHOLDERS (placeholder: true):
 * visible in development for layout review, hidden in production — where the page
 * shows an elegant "New events coming soon" card until real events are added.
 */
import type { z } from "zod";

import type { EventSchema } from "./schema";

type EventInput = z.input<typeof EventSchema>;

export const events = [
  {
    id: "placeholder-annual-showcase",
    title: "Annual Showcase (placeholder)",
    startsAt: "2027-02-14T17:30:00+05:30",
    venue: "Venue to be announced",
    description:
      "Placeholder event — every batch takes the stage for an evening of Bharatanatyam, Hip-Hop, Bollywood and more.",
    image: {
      src: "/media/events/annual-showcase.jpg",
      alt: "Stage lights over an empty performance stage",
      motif: "stage",
    },
    status: "scheduled",
    placeholder: true, // TODO(confirm)
  },
  {
    id: "placeholder-summer-workshop",
    title: "Summer Intensive (placeholder)",
    startsAt: "2027-04-20T10:00:00+05:30",
    venue: "House of Movements studio",
    description:
      "Placeholder event — a week of intensive workshops across styles for kids and teens.",
    status: "scheduled",
    placeholder: true, // TODO(confirm)
  },
] satisfies EventInput[];
