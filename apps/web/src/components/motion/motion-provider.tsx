"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { duration, ease } from "@/lib/motion";

// Animation features load after hydration, keeping them out of the initial bundle.
const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Global motion settings. `reducedMotion="user"` turns transform animations into
 * simple fades for visitors who prefer reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: duration.reveal, ease: ease.expo }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
