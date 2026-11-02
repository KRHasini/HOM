import { Reveal } from "@/components/motion/reveal";
import type { LegalDoc } from "@/content/schema";

import { PageHero } from "./page-hero";
import { Section } from "./section";

/** Clean typographic legal page. Placeholder copy is flagged until reviewed. */
export function LegalDocument({
  eyebrow,
  doc,
  labels,
}: {
  eyebrow: string;
  doc: LegalDoc;
  labels: { draftNotice: string; updated: string };
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={doc.title} intro={`${labels.updated} ${doc.updated}`} />
      <Section surface="ivory">
        <article className="container-hom max-w-3xl">
          {doc.placeholder ? (
            <p className="mb-12 border-l-2 border-gold-deep bg-paper px-5 py-4 text-sm text-muted">
              {labels.draftNotice}
            </p>
          ) : null}
          <p className="font-serif text-lede">{doc.intro}</p>
          {doc.sections.map((section, i) => (
            <Reveal
              as="section"
              key={section.heading}
              className="mt-14 flex flex-col gap-4"
              delay={i * 0.03}
            >
              <h2 className="display text-3xl md:text-4xl">{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p} className="text-ink/80">
                  {p}
                </p>
              ))}
            </Reveal>
          ))}
        </article>
      </Section>
    </>
  );
}
