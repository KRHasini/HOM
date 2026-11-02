import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import manifest from "@/content/generated/media-manifest.json";
import type { ImageRef, VideoRef } from "@/content/schema";

import { type ResolvedImage, type ResolvedVideo, mediaUrl } from "./media";

interface ManifestEntry {
  width: number;
  height: number;
  blurDataURL: string;
}

const entries = manifest as Record<string, ManifestEntry | undefined>;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const existence = new Map<string, boolean>();

/**
 * Build-time check: a real file at the configured path is used automatically;
 * otherwise the art-directed placeholder is rendered.
 */
export function mediaExists(src: string): boolean {
  let found = existence.get(src);
  if (found === undefined) {
    found = existsSync(path.join(PUBLIC_DIR, src));
    existence.set(src, found);
  }
  return found;
}

const DEFAULT_SIZE = { width: 1600, height: 2000 };

export function resolveImage(ref: ImageRef): ResolvedImage {
  const exists = mediaExists(ref.src);
  const meta = exists ? entries[ref.src] : undefined;
  return {
    src: mediaUrl(ref.src),
    alt: ref.alt,
    width: ref.width ?? meta?.width ?? DEFAULT_SIZE.width,
    height: ref.height ?? meta?.height ?? DEFAULT_SIZE.height,
    blurDataURL: meta?.blurDataURL,
    focal: ref.focal,
    motif: ref.motif,
    exists,
    stock: ref.stock,
    path: ref.src,
  };
}

export function resolveVideo(ref: VideoRef): ResolvedVideo {
  const poster = resolveImage({
    src: ref.poster,
    alt: ref.alt,
    width: ref.width,
    height: ref.height,
    motif: ref.motif,
    stock: ref.stock,
  });
  return {
    src: mediaUrl(ref.src),
    webm: ref.webm && mediaExists(ref.webm) ? mediaUrl(ref.webm) : undefined,
    poster,
    captions: ref.captions && mediaExists(ref.captions) ? mediaUrl(ref.captions) : undefined,
    alt: ref.alt,
    width: ref.width,
    height: ref.height,
    motif: ref.motif,
    exists: mediaExists(ref.src),
    stock: ref.stock,
    path: ref.src,
  };
}
