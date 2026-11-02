/**
 * The ONE place media URLs are built. Content refers to media by relative path
 * (e.g. /media/classes/yoga/cover.jpg). Moving media to a CDN or object storage later
 * means setting NEXT_PUBLIC_MEDIA_BASE_URL — nothing else changes.
 */
import type { MotifId } from "@/content/schema";

import { publicEnv } from "./env";

export function mediaUrl(path: string, base: string = publicEnv.mediaBaseUrl): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

/** Resolved, render-ready media handed from server components to UI components. */
export interface ResolvedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  focal?: string;
  motif: MotifId;
  /** False when the file has not been added yet → MediaPlaceholder renders instead. */
  exists: boolean;
  stock: boolean;
  /** Original content path, surfaced by the ?placeholders=1 overlay. */
  path: string;
}

export interface ResolvedVideo {
  src: string;
  webm?: string;
  poster: ResolvedImage;
  captions?: string;
  alt: string;
  width: number;
  height: number;
  motif: MotifId;
  exists: boolean;
  stock: boolean;
  path: string;
}
