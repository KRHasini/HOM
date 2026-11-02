/**
 * Numbers for the stats strip. Never publish unverified numbers: keep `visible: false`
 * until the owner confirms each value, then also set `features.showStats` in site.config.
 */
import type { z } from "zod";

import type { StatSchema } from "./schema";

type StatInput = z.input<typeof StatSchema>;

export const stats = [
  { id: "years", label: "Years of teaching", value: 0, suffix: "+", visible: false }, // TODO(confirm)
  { id: "students", label: "Students trained", value: 0, suffix: "+", visible: false }, // TODO(confirm)
  { id: "performances", label: "Stage performances", value: 0, suffix: "+", visible: false }, // TODO(confirm)
] satisfies StatInput[];
