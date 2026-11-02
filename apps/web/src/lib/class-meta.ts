import type { DanceClass, UiCopy } from "@/content/schema";

/** Meta row for class cards (audience · level · duration) — only confirmed fields show. */
export function classMeta(
  c: Pick<DanceClass, "audiences" | "level" | "durationMinutes">,
  copy: UiCopy["classes"],
): string[] {
  return [
    c.audiences.map((a) => copy.audienceLabels[a]).join(" · "),
    c.level,
    c.durationMinutes ? `${c.durationMinutes} ${copy.durationUnit}` : null,
  ].filter((v): v is string => Boolean(v));
}
