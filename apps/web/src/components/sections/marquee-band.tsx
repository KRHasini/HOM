import { Fragment } from "react";

import { HomMark } from "@/components/brand/hom-mark";
import { Marquee } from "@/components/motion/marquee";
import { cn } from "@/lib/utils";

interface MarqueeBandProps {
  items: string[];
  label: string;
  className?: string;
  direction?: 1 | -1;
}

/** Giant outlined band of class names between scenes; alternate words are solid gold. */
export function MarqueeBand({ items, label, className, direction = -1 }: MarqueeBandProps) {
  return (
    <div className={cn("grain relative overflow-hidden surface-ink py-10 md:py-14", className)}>
      <Marquee label={label} direction={direction}>
        {items.map((item, i) => (
          <Fragment key={item}>
            <span
              className={cn(
                "px-6 display text-[clamp(4.5rem,13vw,12rem)] leading-none md:px-10",
                i % 2 === 0 ? "text-bone/55 text-outline" : "text-gold-light",
              )}
            >
              {item}
            </span>
            <HomMark className="h-[clamp(3rem,7vw,6.5rem)] text-gold/70" />
          </Fragment>
        ))}
      </Marquee>
    </div>
  );
}
