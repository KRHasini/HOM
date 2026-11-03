import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

const surfaces = {
  ink: "surface-ink",
  "ink-soft": "surface-ink-soft",
  ivory: "surface-ivory",
  sand: "surface-sand",
  paper: "bg-paper text-ink",
} as const;

export type Surface = keyof typeof surfaces;

interface SectionProps {
  surface?: Surface;
  children: ReactNode;
  className?: string;
  /** Default vertical rhythm (64px mobile → 200px wide). Disable for full-bleed layouts. */
  padded?: boolean;
  /** Film grain over dark sections (on by default for ink surfaces). */
  grain?: boolean;
  id?: string;
  labelledBy?: string;
  style?: CSSProperties;
}

/**
 * Full-width scene. Alternating ink and ivory surfaces make scrolling feel like moving
 * between scenes; `data-surface` lets nested controls pick AA-safe colors.
 */
export function Section({
  surface = "ink",
  children,
  className,
  padded = true,
  grain,
  id,
  labelledBy,
  style,
}: SectionProps) {
  const light = surface === "ivory" || surface === "paper" || surface === "sand";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={light ? "light" : "dark"}
      style={style}
      className={cn(
        "relative",
        surfaces[surface],
        (grain ?? !light) && "grain",
        padded && "section-y",
        className,
      )}
    >
      {children}
    </section>
  );
}
