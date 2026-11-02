"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Max vertical travel as a percentage of the element (spec: 8–12%). */
  amount?: number;
}

/** Subtle vertical drift for large media. Disabled for reduced motion. */
export function Parallax({ children, className, amount = 10 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount / 2}%`, `${amount / 2}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div className="absolute inset-x-0 -inset-y-[6%]" style={reduced ? undefined : { y }}>
        {children}
      </m.div>
    </div>
  );
}
