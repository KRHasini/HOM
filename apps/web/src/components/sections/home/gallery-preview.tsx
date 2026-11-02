import { HorizontalScroll } from "@/components/motion/horizontal-scroll";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ResolvedGalleryItem } from "@/content";
import { cn } from "@/lib/utils";

import { Section } from "../section";

const shapes = [
  "aspect-[3/4] w-[78vw] sm:w-[46vw] lg:w-[28vw]",
  "aspect-[4/3] w-[86vw] sm:w-[60vw] lg:w-[40vw] lg:self-end",
  "aspect-[4/5] w-[72vw] sm:w-[40vw] lg:w-[24vw] lg:self-center",
  "aspect-square w-[80vw] sm:w-[48vw] lg:w-[30vw]",
];

interface GalleryPreviewProps {
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
  items: ResolvedGalleryItem[];
}

/** Horizontal strip of moments: pinned scroll on desktop, swipeable on touch. */
export function GalleryPreview({ eyebrow, title, cta, items }: GalleryPreviewProps) {
  return (
    <Section
      surface="ink-soft"
      padded={false}
      labelledBy="gallery-preview-title"
      className="overflow-hidden"
    >
      <HorizontalScroll
        label={title}
        className="flex flex-col justify-center py-(--section-y) lg:min-h-svh lg:py-0"
        trackClassName="items-start gap-5 lg:items-center lg:gap-8"
      >
        <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center gap-8 sm:w-[50vw] lg:w-[32vw] lg:pr-8">
          <SectionHeading id="gallery-preview-title" eyebrow={eyebrow} title={title} />
          <ButtonLink href={cta.href} variant="ghost" arrow className="w-fit text-gold-light">
            {cta.label}
          </ButtonLink>
        </div>
        {items.map((item, i) => {
          const image = item.kind === "image" ? item.media : item.media.poster;
          return (
            <figure
              key={item.id}
              className={cn("group/fig relative shrink-0 snap-start", shapes[i % shapes.length])}
            >
              <div className="relative size-full overflow-hidden rounded-xs">
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover/fig:scale-105">
                  <SmartImage image={image} sizes="(min-width: 1024px) 34vw, 80vw" />
                </div>
              </div>
              <figcaption className="absolute -bottom-8 left-0 eyebrow text-bone/70">
                {item.caption}
              </figcaption>
            </figure>
          );
        })}
      </HorizontalScroll>
    </Section>
  );
}
