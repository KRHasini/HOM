/**
 * Gallery media. Files live in public/media/gallery/ (see public/media/README.md).
 * Current images and clips are licensed stock (`stock: true`) graded to the brand —
 * TODO(confirm): replace with the studio's own photography and footage.
 */
import type { z } from "zod";

import type { GallerySchema } from "./schema";

type GalleryInput = z.input<typeof GallerySchema>;

const photo = (
  n: number,
  category: "classes" | "performances" | "events" | "studio",
  caption: string,
  alt: string,
  focal?: string,
) => {
  const id = `photo-${String(n).padStart(3, "0")}`;
  return {
    id,
    kind: "image" as const,
    category,
    caption,
    media: { src: `/media/gallery/${id}.jpg`, alt, focal, motif: "stage" as const, stock: true },
  };
};

export const gallery = {
  categories: [
    { id: "classes", label: "Classes" },
    { id: "performances", label: "Performances" },
    { id: "events", label: "Events" },
    { id: "studio", label: "Studio" },
  ],
  items: [
    photo(
      1,
      "performances",
      "Golden hour on stage",
      "Dancer in a flowing dress under warm amber stage light",
    ),
    {
      id: "video-001",
      kind: "video",
      category: "studio",
      caption: "Under the spotlight",
      media: {
        src: "/media/gallery/video-001.mp4",
        webm: "/media/gallery/video-001.webm",
        poster: "/media/gallery/video-001-poster.jpg",
        alt: "A dancer turns slowly beneath a single spotlight in a dark studio",
        width: 1280,
        height: 720,
        motif: "stage",
        stock: true,
      },
    },
    photo(2, "performances", "Backlit", "Silhouette of a dancer backlit in a dark room"),
    photo(3, "performances", "Flight", "Dancer leaping across a black stage"),
    photo(4, "classes", "Lines", "Dancer extending both arms through a trailing white scarf"),
    photo(5, "studio", "At the barre", "Dancers practising at the barre in a monochrome studio"),
    photo(6, "studio", "Studio floor", "Warm wooden studio floor lit by overhead lights"),
    photo(7, "performances", "Classical duet", "Two Bharatanatyam dancers performing on stage"),
    {
      id: "video-002",
      kind: "video",
      category: "classes",
      caption: "Smoke & rhythm",
      media: {
        src: "/media/gallery/video-002.mp4",
        webm: "/media/gallery/video-002.webm",
        poster: "/media/gallery/video-002-poster.jpg",
        alt: "A dancer moves energetically through stage haze",
        width: 1280,
        height: 720,
        motif: "stage",
        stock: true,
      },
    },
    photo(8, "performances", "Crew", "Hip-hop crew performing in purple stage light"),
    photo(9, "classes", "Dance fitness", "Group fitness class moving together in a bright studio"),
    photo(10, "classes", "On the mat", "Yoga class holding a lunge together"),
    photo(11, "performances", "Ensemble", "Four dancers performing in unison in black and white"),
    photo(12, "performances", "Duet", "Two dancers mid-jump on a dark stage"),
    photo(13, "classes", "Extension", "Dancer in a high kick in a moody blue studio"),
    photo(14, "events", "Celebration", "Blurred dancers in vibrant costumes during a celebration"),
    photo(15, "studio", "The space", "Empty rehearsal room with tall arched windows"),
    photo(16, "events", "Open air", "Dancer leaping in a forest clearing"),
  ],
  youtube: {
    title: "Watch on YouTube",
    text: "Performances, rehearsals and class highlights from the studio.",
    featuredVideoIds: [], // TODO(confirm): add YouTube video ids to embed featured videos
  },
} satisfies GalleryInput;
