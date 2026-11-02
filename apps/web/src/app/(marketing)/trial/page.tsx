import type { Metadata } from "next";
import { Suspense } from "react";

import { TrialWizard } from "@/components/forms/trial-wizard";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SmartImage } from "@/components/media/smart-image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getAbout, getClasses, getFormsCopy, getLegal, getPage, getSite, getUi } from "@/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("trial");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/trial" });

export default async function TrialPage() {
  const site = getSite();
  const ui = getUi();
  const legal = getLegal();
  const forms = getFormsCopy();
  const about = getAbout();
  const classes = await getClasses();

  return (
    <section
      aria-labelledby="page-title"
      data-surface="dark"
      className="grain relative min-h-svh bg-ink pt-[calc(var(--header-h)+3rem)] pb-24 text-ivory lg:pb-32"
    >
      <div className="container-hom grid gap-14 lg:grid-cols-12 lg:gap-10">
        <aside className="flex flex-col gap-8 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:flex lg:flex-col lg:gap-8">
            <Reveal y={12}>
              <Eyebrow>{page.hero.eyebrow}</Eyebrow>
            </Reveal>
            <SplitText
              as="h1"
              id="page-title"
              trigger="mount"
              delay={0.1}
              text={page.hero.title}
              className="mt-6 display text-[clamp(4rem,10vw,8.5rem)] leading-[0.86] lg:mt-0"
            />
            {page.hero.intro ? (
              <Reveal delay={0.3}>
                <p className="mt-6 font-serif text-lede text-bone/80 italic lg:mt-0">
                  {page.hero.intro}
                </p>
              </Reveal>
            ) : null}
            <Reveal
              delay={0.4}
              className="relative mt-8 hidden aspect-[4/5] overflow-hidden rounded-xs lg:block"
            >
              <SmartImage image={about.hero.image} sizes="30vw" quality={60} />
            </Reveal>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border border-hairline bg-ink-soft/80 p-6 md:p-12">
            <Suspense>
              <TrialWizard
                classes={classes.map((c) => ({
                  slug: c.slug,
                  name: c.name,
                  tagline: c.tagline,
                  accent: c.accent,
                }))}
                copy={forms}
                consentText={legal.formConsent}
                optionalLabel={ui.forms.optional}
                submitting={ui.forms.submitting}
                sent={ui.forms.success}
                messages={ui.forms}
                whatsapp={site.whatsapp}
                nextSteps={site.trial.nextSteps}
                privacyHref="/privacy"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
