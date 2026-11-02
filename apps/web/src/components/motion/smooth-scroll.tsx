"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** The active Lenis instance (null on touch-first/reduced-motion or before load). */
export const getLenis = () => instance;

/**
 * Lenis smooth scrolling, loaded lazily after hydration so it never blocks first paint.
 * Disabled for reduced motion. Native touch scrolling is preserved on phones.
 */
export function SmoothScroll({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;

    void import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      instance = new LenisCtor({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1, anchors: true });
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      instance = null;
    };
  }, [enabled]);

  // Start every route at the top (hash links are handled by Lenis `anchors`).
  useEffect(() => {
    if (!window.location.hash) instance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
