import { HomMark } from "@/components/brand/hom-mark";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
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
      <HomMark className="absolute -right-24 -bottom-24 size-[28rem] text-gold/[0.07]" />
      <div className="relative flex flex-col items-center gap-6">
        <Reveal y={12}>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </Reveal>
        <SplitText
          as="h1"
          trigger="mount"
          text={copy.title}
          className="display text-[clamp(4rem,14vw,11rem)] leading-[0.86]"
        />
        <Reveal delay={0.3}>
          <p className="max-w-md font-serif text-lede text-bone/80 italic">{copy.text}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <ButtonLink href={copy.cta.href} size="lg" arrow>
            {copy.cta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
