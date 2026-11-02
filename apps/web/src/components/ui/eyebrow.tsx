import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small, tracked-out uppercase label with a gold rule — pairs with Anton headlines. */
export function Eyebrow({
  children,
  className,
  rule = true,
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
