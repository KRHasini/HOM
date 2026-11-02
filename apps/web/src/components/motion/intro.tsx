import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Above-the-fold intro primitives. Pure CSS (see `.hero-*` in globals.css): they play
 * from the very first paint, before hydration, so hero headlines — usually the LCP
 * element — never wait for JavaScript. Below the fold, use SplitText / Reveal.
 */

export const introDelay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

interface IntroTextProps {
  /** A string splits into words; an array renders each entry as its own line. */
  text: string | string[];
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  /** Applied to each line when `text` is an array (supports :even/:last variants). */
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}

export function IntroText({
  text,
  as: Tag = "h1",
  id,
  className,
  lineClassName,
  delay = 80,
  stagger = 100,
}: IntroTextProps) {
  const lines = (Array.isArray(text) ? text : [text]).map((line) =>
    line.split(/\s+/).filter(Boolean),
  );
  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length, 0));

  const renderWords = (words: string[], offset: number) =>
    words.map((w, j) => (
      <span key={`${w}-${j}`}>
        <span className="inline-block overflow-hidden pt-[0.06em] pb-[0.04em] align-bottom">
          <span
            className="inline-block hero-word"
            style={introDelay(delay + (offset + j) * stagger)}
          >
            {w}
          </span>
        </span>
        {j < words.length - 1 ? " " : null}
      </span>
    ));

  return (
    <Tag id={id} className={className}>
      {Array.isArray(text)
        ? lines.map((words, i) => (
            <span key={`${text[i]}-${i}`} className={cn("block", lineClassName)}>
              {renderWords(words, offsets[i] ?? 0)}
            </span>
          ))
        : renderWords(lines[0] ?? [], 0)}
    </Tag>
  );
}

/** Fade-and-rise for supporting intro elements (eyebrow, lede, CTAs). */
export function IntroRise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={cn("hero-rise", className)} style={introDelay(delay)}>
      {children}
    </div>
  );
}

/** Self-drawing gold rule for intros. */
export function IntroLine({ delay = 0, className }: { delay?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px hero-line bg-gold", className)}
      style={introDelay(delay)}
    />
  );
}
