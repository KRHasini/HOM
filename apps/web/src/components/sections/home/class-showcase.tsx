"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getLenis } from "@/components/motion/smooth-scroll";
import { SmartImage } from "@/components/media/smart-image";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { QUERIES, useMediaQuery } from "@/lib/hooks/use-media-query";
import { duration, ease } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";

import { ClassCard, type ClassCardData } from "../classes/class-card";

export type ShowcaseClass = ClassCardData & { summary: string };

/**
 * Signature section. Desktop: a pinned stage — scrolling (or hovering the list) swaps
 * a large background image with a clip + cross-fade while the active class name scales
 * up with its tagline. Mobile: a vertical stack of tall cards that reveal on scroll.
 */
export function ClassShowcase({
  classes,
  exploreLabel,
}: {
  classes: ShowcaseClass[];
  exploreLabel: string;
}) {
  // Both layouts render; CSS picks one per breakpoint so hydration never shifts layout.
  return (
    <>
      <div className="hidden lg:block">
        <PinnedShowcase classes={classes} exploreLabel={exploreLabel} />
      </div>
      <ul className="container-hom grid gap-4 pb-(--section-y) sm:grid-cols-2 lg:hidden">
        {classes.map((c, i) => (
          <li key={c.slug}>
            <ClassCard item={c} index={i} sizes="(min-width: 640px) 50vw, 100vw" />
          </li>
        ))}
      </ul>
    </>
  );
}

function PinnedShowcase({
  classes,
  exploreLabel,
}: {
  classes: ShowcaseClass[];
  exploreLabel: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const current = classes[active] ?? classes[0]!;

  const desktop = useMediaQuery(QUERIES.desktop);

  // Scroll progress through the tall wrapper selects the active class (GSAP ScrollTrigger).
  useEffect(() => {
    if (!desktop) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        const section = sectionRef.current;
        if (cancelled || !section) return;
        gsap.registerPlugin(ScrollTrigger);
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            setActive(Math.min(classes.length - 1, Math.floor(self.progress * classes.length)));
          },
        });
        const lenis = getLenis();
        const onScroll = () => ScrollTrigger.update();
        lenis?.on("scroll", onScroll);
        cleanup = () => {
          lenis?.off("scroll", onScroll);
          trigger.kill();
        };
      },
    );
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [classes.length, desktop]);

  return (
    <div ref={sectionRef} style={{ height: `${classes.length * 55 + 45}svh` }} className="relative">
      <div className="sticky top-0 flex h-svh items-stretch overflow-hidden">
        {/* Stage: stacked covers, the active one wipes in. */}
        <div className="absolute inset-0" aria-hidden="true">
          {classes.map((c, i) => (
            <m.div
              key={c.slug}
              className="absolute inset-0"
              initial={false}
              animate={
                i === active
                  ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 }
                  : {
                      clipPath: i < active ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
                      opacity: 0.4,
                      scale: 1.08,
                    }
              }
              transition={{ duration: 1.1, ease: ease.inOut }}
              style={{ zIndex: i === active ? 2 : 1 }}
            >
              <SmartImage
                image={c.cover}
                sizes="100vw"
                quality={75}
                treatment={c.treatment === "monochrome" ? "monochrome" : "editorial"}
                accent={c.accent}
              />
            </m.div>
          ))}
          <div className="absolute inset-0 z-[3] bg-linear-to-r from-ink via-ink/75 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 z-[3] h-1/3 bg-linear-to-t from-ink to-transparent" />
        </div>

        <div className="relative z-[4] container-hom grid w-full grid-cols-12 items-center gap-8 pt-(--header-h)">
          <ol className="col-span-6 flex flex-col">
            {classes.map((c, i) => {
              const isActive = i === active;
              return (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={isActive ? "true" : undefined}
                    className="group/item flex items-baseline gap-5 py-1"
                  >
                    <span
                      className={cn(
                        "w-8 eyebrow transition-colors duration-500",
                        isActive ? "text-gold-light" : "text-bone/40",
                      )}
                    >
                      {pad2(i + 1)}
                    </span>
                    <m.span
                      className={cn(
                        "origin-left display text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[1.02] transition-colors duration-500",
                        isActive
                          ? "text-ivory"
                          : "text-bone/45 text-outline group-hover/item:text-bone/80",
                      )}
                      animate={{ scale: isActive ? 1.06 : 1, x: isActive ? 8 : 0 }}
                      transition={{ duration: duration.reveal, ease: ease.expo }}
                    >
                      {c.name}
                    </m.span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="col-span-5 col-start-8 self-end pb-[12svh]">
            <AnimatePresence mode="wait">
              <m.div
                key={current.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: ease.expo }}
                className="flex flex-col gap-5"
              >
                <span
                  className="h-0.5 w-12"
                  style={{ backgroundColor: current.accentOnDark }}
                  aria-hidden="true"
                />
                <p className="font-serif text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight text-ivory italic">
                  {current.tagline}
                </p>
                <p className="max-w-md text-bone/80">{current.summary}</p>
                <ul className="flex flex-wrap gap-2">
                  {current.meta.map((meta) => (
                    <li
                      key={meta}
                      className="rounded-full border border-bone/25 px-3 py-1 text-xs text-bone/80"
                    >
                      {meta}
                    </li>
                  ))}
                </ul>
                <Link
                  href={current.href}
                  className="group/link mt-2 inline-flex w-fit items-center gap-3 eyebrow text-gold-light"
                >
                  <span className="link-underline">
                    {exploreLabel} {current.name}
                  </span>
                  <ArrowIcon className="w-6 transition-transform duration-500 ease-expo group-hover/link:translate-x-1.5" />
                </Link>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div
          className="absolute right-(--gutter) bottom-8 z-[4] flex items-center gap-3"
          aria-hidden="true"
        >
          <span className="eyebrow text-gold-light">{pad2(active + 1)}</span>
          <span className="relative h-px w-24 bg-bone/20">
            <m.span
              className="absolute inset-0 origin-left bg-gold-light"
              initial={false}
              animate={{ scaleX: (active + 1) / classes.length }}
              transition={{ duration: 0.6, ease: ease.expo }}
            />
          </span>
          <span className="eyebrow text-bone/50">{pad2(classes.length)}</span>
        </div>
      </div>
    </div>
  );
}
