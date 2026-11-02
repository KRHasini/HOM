"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { getLenis } from "./smooth-scroll";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  label: string;
}

/**
 * Desktop: the section pins and vertical scroll drives the track sideways (GSAP
 * ScrollTrigger, loaded on demand). Mobile / reduced motion: a native swipeable,
 * scroll-snapping carousel — no JavaScript required.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
  label,
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduced.matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (cancelled || !section || !track) return;
        gsap.registerPlugin(ScrollTrigger);
        // Switch the track from native scrolling to a pinned, transform-driven strip.
        section.dataset.pinned = "true";

        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        const ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }, section);

        const lenis = getLenis();
        const onScroll = () => ScrollTrigger.update();
        lenis?.on("scroll", onScroll);

        cleanup = () => {
          lenis?.off("scroll", onScroll);
          ctx.revert();
          delete section.dataset.pinned;
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={sectionRef} className={cn("group/hscroll relative overflow-hidden", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto overscroll-x-contain px-(--gutter) pb-2",
          "group-data-[pinned=true]/hscroll:w-max group-data-[pinned=true]/hscroll:snap-none group-data-[pinned=true]/hscroll:overflow-visible",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
