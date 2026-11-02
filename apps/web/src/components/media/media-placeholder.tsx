import type { CSSProperties } from "react";

import type { MotifId } from "@/content/schema";
import { cn } from "@/lib/utils";

import { DancerMotif } from "./dancer-motif";

interface MediaPlaceholderProps {
  motif: MotifId;
  /** Content path of the missing file — listed by the ?placeholders=1 overlay. */
  path: string;
  label?: string;
  /** Optional class accent tint layered under the gold. */
  accent?: string;
  className?: string;
}

/**
 * Art-directed duotone (ink → gold) composition used until a real photo or video is
 * dropped at `path`. Soft light, stage rings, film grain and an original dancer motif.
 */
export function MediaPlaceholder({ motif, path, label, accent, className }: MediaPlaceholderProps) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-placeholder={path}
      className={cn("grain absolute inset-0 overflow-hidden bg-ink-soft", className)}
      style={{ "--ph-accent": accent ?? "var(--gold)" } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(60% 50% at 72% 18%, color-mix(in oklab, var(--gold-light) 28%, transparent), transparent 70%)",
            "radial-gradient(55% 45% at 18% 88%, color-mix(in oklab, var(--ph-accent) 35%, transparent), transparent 70%)",
            "linear-gradient(165deg, var(--ink-raised), var(--ink) 70%)",
          ].join(","),
        }}
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full text-gold/25"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="200" cy="300" r="120" strokeWidth="0.6" />
        <circle cx="200" cy="300" r="190" strokeWidth="0.5" />
        <circle cx="200" cy="300" r="270" strokeWidth="0.4" />
        <path d="M0 430 H400" strokeWidth="0.6" />
      </svg>
      <DancerMotif
        motif={motif}
        className="absolute bottom-[12%] left-1/2 h-[62%] max-h-[420px] w-auto -translate-x-1/2 opacity-90 drop-shadow-[0_0_24px_color-mix(in_oklab,var(--gold-light)_25%,transparent)]"
      />
    </div>
  );
}
