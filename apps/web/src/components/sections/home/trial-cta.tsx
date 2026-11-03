import { DeferredQuickTrialForm } from "@/components/forms/deferred-quick-trial-form";
import type { QuickTrialFormProps } from "@/components/forms/quick-trial-form";
import { SplitText } from "@/components/motion/split-text";

import { Section } from "../section";

interface TrialCtaProps {
  title: string;
  form: QuickTrialFormProps;
}

/** The one dark block on a light page: a short heading beside the short form. */
export function TrialCta({ title, form }: TrialCtaProps) {
  return (
    <Section id="trial" surface="sand" labelledBy="trial-cta-title">
      <div className="container-hom">
        <div
          data-surface="dark"
          className="grid gap-10 rounded-sm bg-ink p-8 text-ivory md:p-14 lg:grid-cols-12 lg:items-center lg:gap-16"
        >
          <SplitText
            id="trial-cta-title"
            text={title}
            className="display text-section lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <DeferredQuickTrialForm {...form} />
          </div>
        </div>
      </div>
    </Section>
  );
}
