import type { Metadata } from "next";

import { ClassGrid } from "@/components/sections/classes/class-grid";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { getClasses, getPage, getSite, getUi } from "@/content";
import { classMeta } from "@/lib/class-meta";
import { buildMetadata } from "@/lib/seo";

const page = getPage("classes");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/classes" });

export default async function ClassesPage() {
  const ui = getUi();
  const classes = await getClasses();

  return (
    <>
      <PageHero {...page.hero} image={classes[0]?.cover} />
      <Section surface="ivory" className="pt-12 md:pt-16" labelledBy="class-grid-title">
        <div className="container-hom">
          <h2 id="class-grid-title" className="sr-only">
            {ui.classes.gridTitle}
          </h2>
          <ClassGrid
            classes={classes.map((c) => ({
              slug: c.slug,
              name: c.name,
              tagline: c.tagline,
              href: c.href,
              cover: c.cover,
              accent: c.accent,
              accentContrast: c.accentContrast,
              accentOnDark: c.accentOnDark,
              treatment: c.treatment,
              category: c.category,
              audiences: c.audiences,
              meta: classMeta(c, ui.classes),
            }))}
            labels={{
              filter: ui.classes.filterLabel,
              all: ui.classes.allLabel,
              empty: ui.classes.emptyState,
              categories: ui.classes.categoryLabels,
              audiences: ui.classes.audienceLabels,
            }}
          />
        </div>
      </Section>
    </>
  );
}
