/** Custom line marks for the four pillars — dance-specific, drawn for HOM. */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Temple gopuram silhouette — heritage. */
function Tradition(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 42h28M13 42V33h22v9M16 33v-7h16v7M19 26v-6h10v6M22 20v-5h4v5M24 15V9" />
      <circle cx="24" cy="7.5" r="1.5" />
      <path d="M21 42v-5a3 3 0 0 1 6 0v5" />
    </svg>
  );
}

/** Feet in first position on a measured floor line — precision. */
function Technique(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 40h36M10 44v-4M18 44v-4M26 44v-4M34 44v-4M42 44v-4" />
      <path d="M24 34c-6 0-11-3-13-8M24 34c6 0 11-3 13-8" />
      <circle cx="24" cy="14" r="8" />
      <path d="M24 6v16M16 14h16" />
    </svg>
  );
}

/** Figure with arms raised under a spotlight — presence. */
function Confidence(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 3 12 42M24 3l12 39" strokeDasharray="2 3" />
      <circle cx="24" cy="18" r="2.5" />
      <path d="M24 21v10M24 31l-4 9M24 31l4 9M24 24l-7-7M24 24l7-7" />
    </svg>
  );
}

/** Concentric rings converging on a point — focus. */
function Discipline(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="11" />
      <circle cx="24" cy="24" r="4" />
      <path d="M24 2v6M24 40v6M2 24h6M40 24h6" />
    </svg>
  );
}

export const pillarIcons = {
  tradition: Tradition,
  technique: Technique,
  confidence: Confidence,
  discipline: Discipline,
} as const;
