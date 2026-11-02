import { DrawLine } from "@/components/motion/draw-line";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { pillarIcons } from "@/components/icons/pillar-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { pad2 } from "@/lib/utils";

import { Section } from "../section";

interface PillarsProps {
  eyebrow: string;
  title: string;
  intro?: string;
  items: { title: string; text: string; icon: keyof typeof pillarIcons }[];
}

/** "Why HOM": four large numbered columns with line marks and self-drawing hairlines. */
export function Pillars({ eyebrow, title, intro, items }: PillarsProps) {
  return (
    <Section surface="ivory" labelledBy="pillars-title">
      <div className="container-hom">
        <SectionHeading
          id="pillars-title"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          surface="light"
        />
        <DrawLine className="mt-16 text-gold md:mt-24" />
        <RevealGroup as="ol" className="grid sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
          {items.map((item, i) => {
            const Icon = pillarIcons[item.icon];
            return (
              <RevealItem
                as="li"
                key={item.title}
                className="flex flex-col gap-6 border-b border-hairline py-10 sm:px-6 sm:odd:pl-0 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <div className="flex items-start justify-between">
                  <span className="display text-[clamp(4.5rem,8vw,7.5rem)] leading-none text-gold-deep text-outline">
                    {pad2(i + 1)}
                  </span>
                  <Icon className="size-12 text-gold-deep" />
                </div>
                <h3 className="display text-4xl">{item.title}</h3>
                <p className="text-muted">{item.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
