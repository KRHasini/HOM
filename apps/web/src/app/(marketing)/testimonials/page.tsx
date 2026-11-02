import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { TestimonialsBoard } from "@/components/sections/testimonials-board";
import { getPage, getSite, getTestimonials, getUi } from "@/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("testimonials");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/testimonials" });

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  // Hidden in production until real (non-placeholder) testimonials exist.
  if (testimonials.length === 0) notFound();
  const ui = getUi().testimonials;

  return (
    <>
      <PageHero {...page.hero} />
      <Section surface="ivory">
        <div className="container-hom">
          <TestimonialsBoard
            items={testimonials.map((t) => ({
              id: t.id,
              quote: t.quote,
              name: t.name,
              relation: t.relation,
              classSlug: t.classSlug,
              className: t.className,
            }))}
            labels={{ all: ui.filterAll, empty: ui.empty, relations: ui.relationLabels }}
          />
        </div>
      </Section>
    </>
  );
}
