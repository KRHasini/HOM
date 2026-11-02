"use client";

import { m } from "motion/react";

import { duration, ease, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DrawLineProps {
  className?: string;
  /** Draw on mount rather than on first view. */
  immediate?: boolean;
  delay?: number;
  orientation?: "horizontal" | "vertical";
}

/**
 * Gold hairline rule that draws itself across (transform-only, so it stays crisp at
 * 1px on every screen). SVG path drawing is used for icons and the success check.
 */
export function DrawLine({
  className,
  immediate = false,
  delay = 0,
  orientation = "horizontal",
}: DrawLineProps) {
  const horizontal = orientation === "horizontal";
  const axis = horizontal ? "scaleX" : "scaleY";
  const trigger = immediate
    ? { animate: { [axis]: 1 } }
    : { whileInView: { [axis]: 1 }, viewport: { once: viewport.once, amount: 0.8 } };

  return (
    <m.span
      aria-hidden="true"
      className={cn(
        "block bg-gold",
        horizontal ? "h-px w-full origin-left" : "h-full w-px origin-top",
        className,
      )}
      initial={{ [axis]: 0 }}
      transition={{ duration: duration.revealSlow + 0.4, ease: ease.inOut, delay }}
      {...trigger}
    />
  );
}
