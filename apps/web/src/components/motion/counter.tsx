"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { ease } from "@/lib/motion";

interface CounterProps {
  value: number;
  suffix?: string;
  className?: string;
  durationSeconds?: number;
}

const format = (n: number, suffix: string) => `${Math.round(n).toLocaleString("en-IN")}${suffix}`;

/** Counts up from zero the first time it becomes visible. */
export function Counter({ value, suffix = "", className, durationSeconds = 1.8 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduced) {
      node.textContent = format(value, suffix);
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: ease.expo,
      onUpdate: (latest) => {
        node.textContent = format(latest, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, durationSeconds, suffix]);

  return (
    <span ref={ref} className={className} aria-label={format(value, suffix)}>
      {format(0, suffix)}
    </span>
  );
}
