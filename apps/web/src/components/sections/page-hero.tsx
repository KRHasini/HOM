import type { ReactNode } from "react";

import { IntroRise, IntroText } from "@/components/motion/intro";
import { Parallax } from "@/components/motion/parallax";
import { SmartImage } from "@/components/media/smart-image";
import type { ResolvedImage } from "@/lib/media";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  intro?: string;
  image?: ResolvedImage;
  children?: ReactNode;
  /** Section copy still carries an eyebrow; the title says it already, so it is not shown. */
  eyebrow?: string;
}

/** Inner-page hero: a calm title and one line of intro, over ivory or a softened photo. */
export function PageHero({ title, intro, image, children }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      data-surface={image ? "dark" : "light"}
      className={cn(
        "relative flex flex-col justify-end overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-12 md:pb-16",
        image ? "min-h-[48svh] bg-ink text-ivory md:min-h-[56svh]" : "surface-ivory",
      )}
    >
      {image ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Parallax amount={10} className="absolute inset-0">
            <SmartImage image={image} sizes="100vw" preload quality={60} />
          </Parallax>
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/70 to-transparent" />
        </div>
      ) : null}
      <div className="relative z-[3] container-hom flex flex-col gap-5">
        <IntroText id="page-title" text={title} delay={120} className="display text-hero" />
        {intro ? (
          <IntroRise delay={300}>
            <p
              className={cn(
                "max-w-xl font-serif text-lede italic",
                image ? "text-bone/90" : "text-muted",
              )}
            >
              {intro}
            </p>
          </IntroRise>
        ) : null}
        {children}
      </div>
    </section>
  );
}
