"use client";

import { m, type Variants } from "motion/react";
import { Fragment } from "react";

import { duration, ease, stagger as staggerTokens, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const tags = { h1: m.h1, h2: m.h2, h3: m.h3, p: m.p, span: m.span, div: m.div } as const;

interface SplitTextProps {
  /** A string splits into words; an array renders each entry as its own line. */
  text: string | string[];
  as?: keyof typeof tags;
  className?: string;
  lineClassName?: string;
  /** `mount` plays immediately (hero); `view` plays on first view. */
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  id?: string;
}

const wordVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: duration.revealSlow, ease: ease.expo } },
};

function Words({ line }: { line: string }) {
  const words = line.split(/\s+/).filter(Boolean);
  return words.map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="inline-block overflow-hidden pt-[0.06em] pb-[0.04em] align-bottom">
        <m.span className="inline-block" variants={wordVariants}>
          {w}
        </m.span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

/**
 * Headline that slides up word by word through a mask. Text stays real DOM text for
 * SEO and screen readers; only transforms animate.
 */
export function SplitText({
  text,
  as = "h2",
  className,
  lineClassName,
  trigger = "view",
  delay = 0,
  stagger = staggerTokens.loose,
  id,
}: SplitTextProps) {
  const Component = tags[as] as (typeof tags)["h2"];
  const play =
    trigger === "mount"
      ? { animate: "show" }
      : {
          whileInView: "show",
          viewport: { once: viewport.once, amount: 0.4, margin: viewport.margin },
        };

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...play}
    >
      {Array.isArray(text) ? (
        text.map((line, i) => (
          <span key={`${line}-${i}`} className={cn("block", lineClassName)}>
            <Words line={line} />
          </span>
        ))
      ) : (
        <Words line={text} />
      )}
    </Component>
  );
}
