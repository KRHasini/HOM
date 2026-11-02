import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/** Small row of verified badges. Unverified claims are filtered out in the accessor. */
export function TrustStrip({ items }: { items: { label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grain relative border-y border-hairline-soft surface-ink">
      <RevealGroup
        as="ul"
        className="container-hom flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 md:justify-between"
        stagger={0.08}
      >
        {items.map((item) => (
          <RevealItem
            as="li"
            key={item.label}
            className="flex items-center gap-3 eyebrow text-bone/85"
          >
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
            {item.label}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
