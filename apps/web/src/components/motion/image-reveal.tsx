"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { duration, ease, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const clipFrom = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
} as const;

interface ImageRevealProps {
  children: ReactNode;
  /** Sizing/positioning classes for the frame (e.g. aspect ratio, width). */
  className?: string;
  direction?: keyof typeof clipFrom;
  delay?: number;
  /** Reveal immediately instead of on first view (above-the-fold media). */
  immediate?: boolean;
}

/**
 * Clip-path wipe with a slight scale-down (1.15 → 1) on the media inside.
 * The viewport is observed on an unclipped wrapper: browsers report a fully clipped
 * element as not intersecting, which would otherwise keep it hidden forever.
 */
export function ImageReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  immediate = false,
}: ImageRevealProps) {
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: viewport.once, amount: 0.2 } };
  const transition = { duration: duration.revealSlow + 0.2, ease: ease.inOut, delay };

  return (
    <m.div className={cn("relative", className)} initial="hidden" {...trigger}>
      <m.div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        variants={{
          hidden: { clipPath: clipFrom[direction] },
          show: { clipPath: "inset(0% 0% 0% 0%)", transition },
        }}
      >
        <m.div
          className="size-full"
          variants={{
            hidden: { scale: 1.15 },
            show: {
              scale: 1,
              transition: { ...transition, duration: transition.duration + 0.4, ease: ease.expo },
            },
          }}
        >
          {children}
        </m.div>
      </m.div>
    </m.div>
  );
}
