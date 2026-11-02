import Link from "next/link";
import type { CSSProperties } from "react";

import { SmartImage } from "@/components/media/smart-image";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { ResolvedImage } from "@/lib/media";
import { cn, pad2 } from "@/lib/utils";

export interface ClassCardData {
  slug: string;
  name: string;
  tagline: string;
  href: string;
  cover: ResolvedImage;
  accent: string;
  accentContrast: string;
  accentOnDark: string;
  meta: string[];
  treatment: string;
}

interface ClassCardProps {
  item: ClassCardData;
  index: number;
  sizes: string;
  className?: string;
}

/**
 * Tall, image-led class card. On hover it lifts, tints to the class accent, draws a
 * gold underline and slides its arrow.
 */
export function ClassCard({ item, index, sizes, className }: ClassCardProps) {
  return (
    <Link
      href={item.href}
      data-cursor="View"
      style={
        { "--card-accent": item.accent, "--card-accent-dot": item.accentOnDark } as CSSProperties
      }
      className={cn(
        "group/card relative block aspect-[3/4] overflow-hidden rounded-xs bg-ink-soft text-ivory",
        "transition-transform duration-700 ease-expo hover:-translate-y-1.5",
        className,
      )}
    >
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-expo group-hover/card:scale-105">
        <SmartImage
          image={item.cover}
          sizes={sizes}
          treatment={item.treatment === "monochrome" ? "monochrome" : "editorial"}
          accent={item.accent}
        />
      </div>
      {/* Accent tint fades in on hover; the base gradient keeps text legible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--card-accent) opacity-0 mix-blend-multiply transition-opacity duration-700 ease-expo group-hover/card:opacity-35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 via-35% to-transparent to-70%"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="eyebrow text-bone/80">{pad2(index + 1)}</span>
        <span className="size-2 rounded-full bg-(--card-accent-dot)" aria-hidden="true" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 md:p-6">
        <h3 className="display text-[clamp(2.25rem,7vw,3rem)] leading-[0.95] md:text-5xl">
          {item.name}
        </h3>
        <p className="font-serif text-lg leading-snug text-bone italic">{item.tagline}</p>
        <div className="flex items-end justify-between gap-4 pt-1">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs tracking-wide text-bone/75">
            {item.meta.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="size-1 rounded-full bg-gold/70" />
                ) : null}
                {m}
              </li>
            ))}
          </ul>
          <ArrowIcon className="w-7 shrink-0 text-gold-light transition-transform duration-500 ease-expo group-hover/card:translate-x-1.5" />
        </div>
        <span
          aria-hidden="true"
          className="mt-1 h-px w-full origin-left scale-x-0 bg-gold-light transition-transform duration-700 ease-expo group-hover/card:scale-x-100"
        />
      </div>
    </Link>
  );
}
