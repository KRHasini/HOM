import Link from "next/link";
import type { CSSProperties } from "react";

import { SmartImage } from "@/components/media/smart-image";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { ResolvedImage } from "@/lib/media";
import { cn } from "@/lib/utils";

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
  sizes: string;
  className?: string;
}

/** Quiet class card: a rounded photo, the name and one line beneath it. */
export function ClassCard({ item, sizes, className }: ClassCardProps) {
  return (
    <Link
      href={item.href}
      data-cursor="View"
      style={{ "--card-accent": item.accent } as CSSProperties}
      className={cn("group/card flex flex-col gap-4", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover/card:scale-[1.04]">
          <SmartImage
            image={item.cover}
            sizes={sizes}
            treatment={item.treatment === "monochrome" ? "monochrome" : "editorial"}
            accent={item.accent}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="display text-2xl leading-tight">{item.name}</h3>
          <p className="text-sm text-muted">{item.tagline}</p>
        </div>
        <ArrowIcon className="mt-2 w-5 shrink-0 text-gold-deep transition-transform duration-500 ease-expo group-hover/card:translate-x-1.5" />
      </div>
    </Link>
  );
}
