import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small tracked label; the gold rule is opt-in. */
export function Eyebrow({
  children,
  className,
  rule = false,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={cn("flex items-center gap-3 eyebrow text-gold-light", className)}>
      {rule ? <span aria-hidden="true" className="h-px w-8 bg-current" /> : null}
      {children}
    </Tag>
  );
}
