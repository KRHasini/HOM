import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { FaqList } from "@/components/sections/faq-list";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { getFaqGroups, getNavigation, getPage, getSite } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import { pad2 } from "@/lib/utils";

const page = getPage("faq");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/faq" });

export default async function FaqPage() {
  const groups = getFaqGroups();
  const navigation = await getNavigation();

  return (
    <>
      <PageHero {...page.hero} />
      <Section surface="ivory">
        <div className="container-hom grid gap-12 lg:grid-cols-12">
          <nav aria-label="FAQ topics" className="hidden lg:col-span-3 lg:block">
            <ul className="sticky top-[calc(var(--header-h)+2rem)] flex flex-col gap-3">
              {groups.map((g, i) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="link-underline eyebrow text-ink/70 hover:text-ink"
                  >
                    {pad2(i + 1)} · {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-20 lg:col-span-8 lg:col-start-5">
            {groups.map((g, i) => (
              <section
                key={g.id}
                id={g.id}
                aria-labelledby={`${g.id}-title`}
                className="scroll-mt-32"
              >
                <Reveal className="mb-6 flex items-baseline gap-4">
                  <span className="eyebrow text-gold-deep">{pad2(i + 1)}</span>
                  <h2 id={`${g.id}-title`} className="display text-4xl md:text-5xl">
                    {g.title}
                  </h2>
                </Reveal>
                <FaqList items={g.items} />
              </section>
            ))}
            <Reveal>
              <ButtonLink href={navigation.cta.contact.href} variant="ink" size="lg" arrow>
                {navigation.cta.contact.label}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </Section>
      <JsonLd data={faqJsonLd(groups.flatMap((g) => g.items))} />
    </>
  );
}
