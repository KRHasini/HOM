"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { ArrowIcon } from "@/components/ui/arrow-icon";
import { track } from "@/lib/analytics";
import { ease } from "@/lib/motion";

/**
 * "Book a free trial for {class}" — appears once the hero is passed and hides near the
 * end of the page. Sits above the mobile action bar; links preselect the class.
 */
export function StickyClassCta({
  label,
  href,
  slug,
}: {
  label: string;
  href: string;
  slug: string;
}) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 900;
    setVisible(y > window.innerHeight * 0.8 && !nearEnd);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          className="fixed inset-x-4 bottom-[calc(var(--action-bar-h)+var(--safe-bottom)+0.75rem)] z-(--z-sticky) md:inset-x-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: ease.expo }}
        >
          <Link
            href={href}
            onClick={() => track("cta_click", { location: "sticky_class_cta", class: slug })}
            className="group/sticky flex min-h-14 items-center justify-between gap-6 rounded-full bg-accent py-2 pr-2 pl-6 text-accent-contrast shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--ink)_60%,transparent)]"
          >
            <span className="text-sm font-semibold tracking-[0.12em] uppercase">{label}</span>
            <span className="grid size-10 place-items-center rounded-full bg-ink text-ivory">
              <ArrowIcon className="w-4 transition-transform duration-500 ease-expo group-hover/sticky:translate-x-0.5" />
            </span>
          </Link>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
