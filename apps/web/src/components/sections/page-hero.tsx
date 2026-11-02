import type { ReactNode } from "react";

import { DrawLine } from "@/components/motion/draw-line";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
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
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_10%,rgb(184_134_59/0.18),transparent_70%)]"
        />
      )}
      <div className="relative z-[3] container-hom flex flex-col gap-6">
        <Reveal y={12}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <SplitText
          as="h1"
          id="page-title"
          trigger="mount"
          delay={0.15}
          text={title}
          className="display text-[clamp(4.25rem,15vw,13rem)] leading-[0.86]"
        />
        <DrawLine immediate delay={0.5} className="max-w-2xl" />
        {intro ? (
          <Reveal delay={0.55}>
            <p className="max-w-xl font-serif text-lede text-bone/85 italic">{intro}</p>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
