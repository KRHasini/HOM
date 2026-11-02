import { QuickTrialForm, type QuickTrialFormProps } from "@/components/forms/quick-trial-form";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { SmartImage } from "@/components/media/smart-image";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedImage } from "@/lib/media";

interface TrialCtaProps {
  eyebrow: string;
  title: string;
  intro?: string;
  formTitle: string;
  image: ResolvedImage;
  form: QuickTrialFormProps;
}

/** Full-bleed dark scene: giant headline, magnetic submit, staggered form fields. */
export function TrialCta({ eyebrow, title, intro, formTitle, image, form }: TrialCtaProps) {
  return (
    <section
      id="trial"
      aria-labelledby="trial-cta-title"
      data-surface="dark"
      className="grain relative overflow-hidden bg-ink py-(--section-y) text-ivory"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Parallax amount={12} className="absolute inset-0 opacity-45">
          <SmartImage image={image} sizes="100vw" quality={60} treatment="duotone" />
        </Parallax>
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/40" />
      </div>

      <div className="relative z-[3] container-hom grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <SplitText
            id="trial-cta-title"
            text={title}
            className="display text-[clamp(4.5rem,13vw,12.5rem)] leading-[0.84]"
          />
          {intro ? (
            <Reveal delay={0.2}>
              <p className="max-w-md font-serif text-lede text-bone/85 italic">{intro}</p>
            </Reveal>
          ) : null}
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <div className="border border-hairline bg-ink/70 p-6 backdrop-blur-md md:p-10">
            <p className="mb-4 eyebrow text-gold-light">{formTitle}</p>
            <QuickTrialForm {...form} />
          </div>
        </div>
      </div>
    </section>
  );
}
