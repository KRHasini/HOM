import type { MotifId } from "@/content/schema";

interface Pose {
  head: [x: number, y: number, r: number];
  strokes: string[];
  fills?: string[];
}

/**
 * Original gestural figures (200×260 viewBox), one per class mood. Drawn as calligraphic
 * strokes so they read as art direction rather than clip-art.
 */
const poses: Record<MotifId, Pose> = {
  leap: {
    head: [112, 58, 9],
    strokes: [
      "M108 70 Q100 95 96 115",
      "M96 115 Q130 112 172 96",
      "M96 115 Q62 128 28 152",
      "M104 80 Q130 64 152 40",
      "M104 80 Q78 78 50 92",
    ],
  },
  arabesque: {
    head: [70, 62, 9],
    strokes: [
      "M74 74 Q86 98 96 118",
      "M96 118 Q96 170 92 226",
      "M96 118 Q140 112 184 98",
      "M80 84 Q56 70 32 54",
      "M80 84 Q110 86 134 72",
    ],
  },
  mudra: {
    head: [100, 50, 9],
    strokes: [
      "M100 62 L100 120",
      "M100 120 Q72 130 62 160 Q58 190 66 216",
      "M100 120 Q128 130 138 160 Q142 190 134 216",
      "M100 78 Q74 76 52 84 Q44 70 48 54",
      "M100 78 Q126 76 148 84 Q160 92 168 106",
    ],
  },
  groove: {
    head: [96, 58, 9],
    strokes: [
      "M98 70 Q104 98 100 124",
      "M100 124 Q80 150 70 178 L80 224",
      "M100 124 Q124 148 120 176 Q132 198 148 218",
      "M100 84 Q76 96 70 122",
      "M100 84 Q126 82 140 64 Q132 50 116 50",
    ],
  },
  twirl: {
    head: [100, 44, 9],
    strokes: [
      "M100 56 Q102 82 100 104",
      "M100 70 Q78 52 70 24",
      "M100 70 Q124 60 146 70 Q156 58 152 42",
    ],
    fills: ["M100 104 Q58 150 46 200 Q100 184 154 200 Q142 150 100 104 Z"],
  },
  balance: {
    head: [100, 198, 9],
    strokes: [
      "M100 186 L84 228",
      "M100 186 L116 228",
      "M100 186 L100 122",
      "M100 122 Q76 82 50 42",
      "M100 122 Q124 82 150 42",
    ],
  },
  burst: {
    head: [100, 46, 9],
    strokes: [
      "M100 58 L100 116",
      "M100 72 Q74 54 50 28",
      "M100 72 Q126 54 150 28",
      "M100 116 Q80 152 60 188",
      "M100 116 Q120 152 140 188",
    ],
  },
  flow: {
    head: [62, 70, 9],
    strokes: [
      "M70 82 Q96 104 104 132",
      "M104 132 Q106 180 98 228",
      "M104 132 Q132 172 152 216",
      "M84 94 Q60 120 48 152",
      "M84 94 Q110 58 154 38",
    ],
  },
  lotus: {
    head: [100, 68, 10],
    strokes: [
      "M100 80 L100 138",
      "M100 96 Q78 116 70 146",
      "M100 96 Q122 116 130 146",
      "M54 160 Q100 136 146 160 Q100 178 54 160",
    ],
  },
  portrait: {
    head: [100, 96, 34],
    strokes: [],
    fills: ["M34 262 Q38 168 100 150 Q162 168 166 262 Z"],
  },
  stage: {
    head: [100, 128, 6],
    strokes: [
      "M100 136 L100 172",
      "M100 172 L92 206",
      "M100 172 Q126 168 146 160",
      "M100 146 Q84 136 72 124",
      "M100 146 Q118 136 128 120",
    ],
    fills: ["M84 0 L116 0 L190 260 L10 260 Z"],
  },
};

export function DancerMotif({ motif, className }: { motif: MotifId; className?: string }) {
  const pose = poses[motif];
  const [cx, cy, r] = pose.head;
  const id = `motif-${motif}`;
  const isSilhouette = motif === "portrait";
  const isStage = motif === "stage";

  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--gold-light)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-light)" stopOpacity={isStage ? 0.16 : 0.5} />
          <stop offset="1" stopColor="var(--gold)" stopOpacity={isStage ? 0 : 0.1} />
        </linearGradient>
      </defs>
      {pose.fills?.map((d) => (
        <path key={d} d={d} fill={`url(#${id}-fill)`} />
      ))}
      <g
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {pose.strokes.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isSilhouette ? `url(#${id}-fill)` : "var(--gold-light)"}
      />
    </svg>
  );
}
