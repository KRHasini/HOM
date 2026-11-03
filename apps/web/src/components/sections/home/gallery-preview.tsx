import { Reveal } from "@/components/motion/reveal";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ResolvedGalleryItem } from "@/content";

import { Section } from "../section";

interface GalleryPreviewProps {
  title: string;
  cta: { label: string; href: string };
  items: ResolvedGalleryItem[];
}

/** A short, even grid of moments — the full gallery lives one click away. */
export function GalleryPreview({ title, cta, items }: GalleryPreviewProps) {
  return (
    <Section surface="ivory" labelledBy="gallery-preview-title">
      <div className="container-hom flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="gallery-preview-title" title={title} surface="light" size="title" />
          <ButtonLink href={cta.href} variant="ghost" arrow className="w-fit text-ink">
            {cta.label}
          </ButtonLink>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {items.map((item, i) => {
            const image = item.kind === "image" ? item.media : item.media.poster;
            return (
              <li key={item.id}>
                <Reveal delay={(i % 4) * 0.06}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
                    <SmartImage image={image} sizes="(min-width: 1024px) 25vw, 50vw" />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
