"use client";

import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Percent of one copy's width travelled per second. */
  speed?: number;
  direction?: 1 | -1;
  label?: string;
}

/**
 * Infinite horizontal band whose speed reacts slightly to scroll velocity.
 * Pauses off-screen; static for reduced motion.
 */
export function Marquee({ children, className, speed = 2.2, direction = -1, label }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const boost = useTransform(velocity, [-2500, 0, 2500], [2.5, 0, 2.5], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return;
    const step = direction * speed * (delta / 1000) * (1 + boost.get());
    baseX.set(baseX.get() + step / 2);
  });

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      role={label ? "marquee" : undefined}
      aria-label={label}
    >
      <m.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </m.div>
    </div>
  );
}
