"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query subscription (false on the server and first paint). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const QUERIES = {
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  saveData: "(prefers-reduced-data: reduce)",
} as const;

/** True when the visitor asked for less data (Save-Data header or media query). */
export function prefersSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData) || window.matchMedia(QUERIES.saveData).matches;
}

const noopSubscribe = () => () => {};

/** Autoplay/heavy motion is allowed unless reduced motion or data-saver is requested. */
export function useAutoplayAllowed(): boolean {
  const reduced = useMediaQuery(QUERIES.reducedMotion);
  const saveData = useSyncExternalStore(noopSubscribe, prefersSaveData, () => true);
  return !reduced && !saveData;
}
