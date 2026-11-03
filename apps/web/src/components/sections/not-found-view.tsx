import { HomMark } from "@/components/brand/hom-mark";
import { IntroRise, IntroText } from "@/components/motion/intro";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getUi } from "@/content";

/** Branded 404 with a dancer-themed line and a way home. */
export function NotFoundView() {
  const copy = getUi().notFound;
  return (
    <section
      data-surface="dark"
      className="grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-(--gutter) py-32 text-center text-ivory"
    >
      <HomMark className="absolute -right-16 -bottom-16 h-[36rem] text-gold/[0.08]" />
      <div className="relative flex flex-col items-center gap-6">
        <IntroRise>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </IntroRise>
        <IntroText
          text={copy.title}
          className="display text-[clamp(4rem,14vw,11rem)] leading-[0.86]"
        />
        <IntroRise delay={300}>
          <p className="max-w-md font-serif text-lede text-bone/80 italic">{copy.text}</p>
        </IntroRise>
        <IntroRise delay={400}>
          <ButtonLink href={copy.cta.href} size="lg" arrow>
            {copy.cta.label}
          </ButtonLink>
        </IntroRise>
      </div>
    </section>
  );
}
