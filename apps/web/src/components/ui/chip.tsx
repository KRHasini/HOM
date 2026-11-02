"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  children: ReactNode;
}

/** Pill-shaped toggle used for filters and multi-select options (≥ 48px touch target). */
export function Chip({ selected, children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-medium tracking-wide",
        "transition-[background-color,color,border-color] duration-300 ease-expo",
        selected
          ? "border-gold bg-gold text-ink"
          : "border-current/25 text-current/80 hover:border-gold-light hover:text-current",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
