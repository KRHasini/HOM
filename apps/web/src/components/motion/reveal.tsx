"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { distance, duration, ease, stagger as staggerTokens, viewport } from "@/lib/motion";

const tags = {
  div: m.div,
  section: m.section,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  p: m.p,
  span: m.span,
  article: m.article,
  header: m.header,
  footer: m.footer,
  figure: m.figure,
  dl: m.dl,
} as const;

type Tag = keyof typeof tags;

interface RevealProps {
  as?: Tag;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Rise distance in px (spec: 24). */
  y?: number;
  amount?: number;
  id?: string;
}

/** Fade and rise on first entering the viewport. */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = distance.rise,
  amount = viewport.amount,
  id,
}: RevealProps) {
  const Component = tags[as];
  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: viewport.once, amount, margin: viewport.margin }}
      transition={{ duration: duration.reveal, ease: ease.expo, delay }}
    >
      {children}
    </Component>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: distance.rise },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.expo } },
};

interface RevealGroupProps extends Omit<RevealProps, "y"> {
  stagger?: number;
}

/** Parent that staggers its RevealItem children (60–90ms apart). */
export function RevealGroup({
  as = "div",
  children,
  className,
  delay = 0,
  stagger = staggerTokens.base,
  amount = 0.15,
  id,
}: RevealGroupProps) {
  const Component = tags[as];
  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewport.once, amount, margin: viewport.margin }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  as = "div",
  children,
  className,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
}) {
  const Component = tags[as];
  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
