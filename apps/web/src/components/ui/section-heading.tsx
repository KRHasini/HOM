import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { cn } from "@/lib/utils";

import { Eyebrow } from "./eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  align?: "start" | "center";
  /** Light surfaces swap gold-light for the AA-safe deep gold. */
  surface?: "dark" | "light";
  size?: "section" | "title";
  className?: string;
  id?: string;
  children?: ReactNode;
}

/** Optional eyebrow, a serif headline (split reveal) and an optional serif-italic intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as = "h2",
  align = "start",
  surface = "dark",
  size = "section",
  className,
  id,
  children,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <header
      className={cn("flex flex-col gap-6", centered && "items-center text-center", className)}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow
            className={cn(surface === "light" && "text-gold-deep", centered && "justify-center")}
          >
            {eyebrow}
          </Eyebrow>
        </Reveal>
      ) : null}
      <SplitText
        as={as}
        id={id}
        text={title}
        className={cn("max-w-[20ch] display", size === "section" ? "text-section" : "text-title")}
      />
      {intro ? (
        <Reveal delay={0.15}>
          <div
            className={cn(
              "max-w-xl font-serif text-lede italic",
              surface === "light" ? "text-muted" : "text-bone/80",
            )}
          >
            {intro}
          </div>
        </Reveal>
      ) : null}
      {children}
    </header>
  );
}
