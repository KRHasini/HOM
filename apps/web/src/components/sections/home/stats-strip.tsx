import { Counter } from "@/components/motion/counter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Stat } from "@/content/schema";

import { Section } from "../section";

/** Count-up stats. Renders nothing until verified numbers are enabled in content. */
export function StatsStrip({ eyebrow, stats }: { eyebrow: string; stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <Section surface="ink" className="py-20 md:py-28" padded={false}>
      <div className="container-hom flex flex-col gap-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <RevealGroup as="dl" className="grid gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <RevealItem
              key={s.id}
              className="flex flex-col-reverse gap-2 border-l border-hairline pl-6"
            >
              <dt className="eyebrow text-bone/70">{s.label}</dt>
              <dd className="display text-[clamp(4rem,9vw,8rem)] leading-none text-gold-light">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
