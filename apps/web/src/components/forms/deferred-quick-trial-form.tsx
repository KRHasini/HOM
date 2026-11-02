"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { QuickTrialFormProps } from "./quick-trial-form";

const QuickTrialForm = dynamic(() => import("./quick-trial-form").then((m) => m.QuickTrialForm), {
  ssr: false,
});

/**
 * Mounts the home-page trial form (validation, form state and API client) only as it
 * approaches the viewport, keeping that code out of the initial bundle. The reserved
 * height prevents layout shift when it mounts.
 */
export function DeferredQuickTrialForm(props: QuickTrialFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[27rem]">
      {mounted ? <QuickTrialForm {...props} /> : null}
    </div>
  );
}
