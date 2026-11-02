import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Two-digit index label used for numbered lists and section counters ("01"). */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function absoluteUrl(path: string, base: string) {
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}

export function formatList(items: string[], conjunction = "&") {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items.at(-1)}`;
}
