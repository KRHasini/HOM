import { IntroRise, IntroText } from "@/components/motion/intro";
import { Magnetic } from "@/components/motion/magnetic";
import { ButtonLink } from "@/components/ui/button";
import type { ResolvedVideo } from "@/lib/media";

import { HeroMedia } from "./hero-media";

interface HeroProps {
  headline: string[];
  primaryCta: { label: string; href: string };
  video: ResolvedVideo;
}

/**
 * Hero: the brand line over a softened looping video and a single call to action.
 *
 * The intro is pure CSS so it plays from the first paint, before hydration — the
 * headline is the LCP element and must never wait for JavaScript.
 */
export function Hero({ headline, primaryCta, video }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      data-surface="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-ivory"
    >
      <HeroMedia video={video} />

      <div className="relative z-[3] container-hom flex flex-1 flex-col justify-end gap-10 pt-[calc(var(--header-h)+3rem)] pb-24">
        <IntroText
          id="hero-title"
          text={headline}
          delay={150}
          stagger={110}
          className="display text-hero"
          lineClassName="last:text-gold-light"
        />
        <IntroRise delay={600}>
          <Magnetic className="inline-block">
            <ButtonLink href={primaryCta.href} size="lg" arrow className="w-full sm:w-auto">
              {primaryCta.label}
            </ButtonLink>
          </Magnetic>
        </IntroRise>
      </div>
    </section>
  );
}
