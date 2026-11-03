import type { CSSProperties } from "react";

import { brand } from "@/content/brand.config";
import { cn } from "@/lib/utils";

const mask = `url(${brand.logo.mark}) center / contain no-repeat`;
const { width, height } = brand.logo.markSize;

/**
 * The HOM mark — the leaping dancer inside the "O" from the studio logo. Rendered as a
 * CSS mask over `currentColor`, so one vector file can appear in gold, ivory or ink.
 * Size it with a height (`h-*`); the width follows the mark's proportions.
 */
export function HomMark({ className, title }: { className?: string; title?: string }) {
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{ aspectRatio: `${width} / ${height}`, mask, WebkitMask: mask } as CSSProperties}
    />
  );
}
