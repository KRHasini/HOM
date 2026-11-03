"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";

import { Chip } from "@/components/ui/chip";
import type { Audience, ClassCategory } from "@/content/schema";
import { ease } from "@/lib/motion";

import { ClassCard, type ClassCardData } from "./class-card";

type GridClass = ClassCardData & { category: ClassCategory; audiences: Audience[] };

interface ClassGridProps {
  classes: GridClass[];
  /** Show the category / audience filters (the /classes page); the home grid is unfiltered. */
  filterable?: boolean;
  labels: {
    filter: string;
    all: string;
    empty: string;
    categories: Record<ClassCategory, string>;
    audiences: Record<Audience, string>;
  };
}

/** Filterable grid (category × audience). Cards animate in with a stagger. */
export function ClassGrid({ classes, labels, filterable = true }: ClassGridProps) {
  const [category, setCategory] = useState<ClassCategory | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);

  const visible = useMemo(
    () =>
      classes.filter(
        (c) =>
          (!category || c.category === category) && (!audience || c.audiences.includes(audience)),
      ),
    [classes, category, audience],
  );

  const categories = Object.keys(labels.categories) as ClassCategory[];
  const audiences = Object.keys(labels.audiences) as Audience[];

  return (
    <div className="flex flex-col gap-12">
      {filterable ? (
      <div
        role="group"
        aria-label={labels.filter}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="-mx-(--gutter) no-scrollbar flex gap-2 overflow-x-auto px-(--gutter) lg:mx-0 lg:px-0">
          <Chip selected={category === null} onClick={() => setCategory(null)}>
            {labels.all}
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c}
              selected={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {labels.categories[c]}
            </Chip>
          ))}
        </div>
        <div className="-mx-(--gutter) no-scrollbar flex gap-2 overflow-x-auto px-(--gutter) lg:mx-0 lg:px-0">
          {audiences.map((a) => (
            <Chip
              key={a}
              selected={audience === a}
              onClick={() => setAudience(audience === a ? null : a)}
            >
              {labels.audiences[a]}
            </Chip>
          ))}
        </div>
      </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {visible.length} / {classes.length}
      </p>

      {visible.length === 0 ? (
        <p className="font-serif text-lede text-muted italic">{labels.empty}</p>
      ) : (
        <m.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((c, i) => (
              <m.li
                key={c.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: ease.expo, delay: (i % 3) * 0.08 }}
              >
                <ClassCard
                  item={c}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}
