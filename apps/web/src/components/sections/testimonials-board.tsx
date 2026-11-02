"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";

import { Chip } from "@/components/ui/chip";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BoardItem {
  id: string;
  quote: string;
  name: string;
  relation: string;
  classSlug?: string;
  className?: string;
}

interface TestimonialsBoardProps {
  items: BoardItem[];
  labels: { all: string; empty: string; relations: Record<string, string> };
}

/** Large editorial story cards, filterable by class. Video-ready via the content model. */
export function TestimonialsBoard({ items, labels }: TestimonialsBoardProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const classes = useMemo(
    () => [
      ...new Map(
        items.filter((i) => i.classSlug).map((i) => [i.classSlug!, i.className ?? i.classSlug!]),
      ).entries(),
    ],
    [items],
  );
  const visible = filter ? items.filter((i) => i.classSlug === filter) : items;

  return (
    <div className="flex flex-col gap-12">
      <div role="group" className="flex flex-wrap gap-2">
        <Chip selected={filter === null} onClick={() => setFilter(null)}>
          {labels.all}
        </Chip>
        {classes.map(([slug, name]) => (
          <Chip key={slug} selected={filter === slug} onClick={() => setFilter(slug)}>
            {name}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-serif text-lede text-muted italic">{labels.empty}</p>
      ) : (
        <m.ul layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((t, i) => (
              <m.li
                layout
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: ease.expo, delay: i * 0.05 }}
                className={cn(
                  "flex flex-col justify-between gap-10 bg-paper p-8 md:p-12",
                  i % 3 === 0 && "md:col-span-2",
                )}
              >
                <blockquote className="font-serif text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.2] italic">
                  <span aria-hidden="true" className="mr-1 text-gold-deep">
                    “
                  </span>
                  {t.quote}
                </blockquote>
                <p className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span aria-hidden="true" className="h-px w-6 bg-ink/30" />
                  <span className="text-muted">
                    {labels.relations[t.relation] ?? t.relation}
                    {t.className ? ` · ${t.className}` : ""}
                  </span>
                </p>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}
