import type { ReactNode } from "react";

import { IntroLine, IntroRise, IntroText } from "@/components/motion/intro";
import { Parallax } from "@/components/motion/parallax";
import { SmartImage } from "@/components/media/smart-image";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedImage } from "@/lib/media";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: ResolvedImage;
  children?: ReactNode;
}

/** Inner-page hero: a giant Anton title over ink (optionally with darkened imagery). */
export function PageHero({ eyebrow, title, intro, image, children }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      data-surface="dark"
      className="grain relative flex min-h-[62svh] flex-col justify-end overflow-hidden bg-ink pt-[calc(var(--header-h)+4rem)] pb-14 text-ivory md:min-h-[72svh] md:pb-20"
    >
      {image ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Parallax amount={10} className="absolute inset-0">
            <SmartImage image={image} sizes="100vw" preload quality={60} />
          </Parallax>
          <div className="absolute inset-0 bg-ink/60" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink to-transparent" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_10%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%)]"
        />
      )}
      <div className="relative z-[3] container-hom flex flex-col gap-6">
        <IntroRise>
          <Eyebrow>{eyebrow}</Eyebrow>
        </IntroRise>
        <IntroText
          id="page-title"
          text={title}
          delay={120}
          className="display text-[clamp(4.25rem,15vw,13rem)] leading-[0.86]"
        />
        <IntroLine delay={420} className="max-w-2xl" />
        {intro ? (
          <IntroRise delay={480}>
            <p className="max-w-xl font-serif text-lede text-bone/85 italic">{intro}</p>
          </IntroRise>
        ) : null}
        {children}
      </div>
    </section>
  );
}
