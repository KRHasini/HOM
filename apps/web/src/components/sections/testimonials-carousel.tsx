"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";

import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ease } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

interface Quote {
  id: string;
  quote: string;
  name: string;
  relation: string;
  className?: string;
}

interface CarouselLabels {
  relationLabels: Record<string, string>;
  previous: string;
  next: string;
}

/** Large editorial pull-quote carousel with keyboard-accessible controls. */
export function TestimonialsCarousel({
  items,
  labels,
}: {
  items: Quote[];
  labels: CarouselLabels;
}) {
  const [index, setIndex] = useState(0);
  const current = items[index];
  if (!current) return null;
  const go = (delta: number) => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      className="flex flex-col gap-12"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative min-h-[18rem] md:min-h-[16rem]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.figure
            key={current.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: ease.expo }}
            className="flex flex-col gap-8"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            <blockquote className="font-serif text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.15] text-balance italic">
              “{current.quote}”
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold">{current.name}</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
              <span className="text-muted">
                {labels.relationLabels[current.relation] ?? current.relation}
                {current.className ? ` · ${current.className}` : ""}
              </span>
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 ? (
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="grid size-12 place-items-center rounded-full border border-current/25 transition-colors hover:border-gold-deep"
          >
            <ArrowIcon direction="left" className="w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="grid size-12 place-items-center rounded-full border border-current/25 transition-colors hover:border-gold-deep"
          >
            <ArrowIcon className="w-5" />
          </button>
          <span className="eyebrow text-muted">
            {pad2(index + 1)} / {pad2(items.length)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
