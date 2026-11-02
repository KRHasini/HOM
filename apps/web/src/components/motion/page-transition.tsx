"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { HomMark } from "@/components/brand/hom-mark";
import { duration, ease } from "@/lib/motion";

type Phase = "idle" | "covering" | "covered" | "revealing";

const NAV_TIMEOUT_MS = 5000;

function shouldIntercept(event: MouseEvent, anchor: HTMLAnchorElement): URL | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (anchor.target && anchor.target !== "_self") ||
    anchor.hasAttribute("download") ||
    anchor.dataset.noTransition !== undefined
  ) {
    return null;
  }
  const url = new URL(anchor.href, window.location.href);
  // Same-path links (hash or query changes) navigate normally, without a curtain.
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) {
    return null;
  }
  return url;
}

/**
 * Curtain wipe in ink with the HOM mark between routes (< 700ms of motion).
 * Intercepts internal link clicks, covers, navigates, then reveals once the new route
 * has rendered. Skipped entirely for reduced motion.
 */
export function PageTransition({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);
  const fromPath = useRef<string | null>(null);
  const timeout = useRef<number | undefined>(undefined);

  const onClick = useCallback((event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const url = shouldIntercept(event, anchor);
    if (!url || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    if (pending.current) return;
    pending.current = url.pathname + url.search + url.hash;
    setPhase("covering");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [enabled, onClick]);

  // New route rendered → reveal.
  useEffect(() => {
    if (phase === "covered" && pathname !== fromPath.current) {
      window.clearTimeout(timeout.current);
      setPhase("revealing");
    }
  }, [pathname, phase]);

  const onCovered = () => {
    const href = pending.current;
    if (!href) return;
    fromPath.current = window.location.pathname;
    setPhase("covered");
    router.push(href);
    // Never leave the curtain down if navigation stalls.
    timeout.current = window.setTimeout(() => setPhase("revealing"), NAV_TIMEOUT_MS);
  };

  const onRevealed = () => {
    pending.current = null;
    setPhase("idle");
  };

  const visible = phase !== "idle";

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          key="curtain"
          aria-hidden="true"
          className="pointer-events-auto fixed inset-0 z-(--z-transition) flex items-center justify-center bg-ink-soft"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={
            phase === "revealing"
              ? { clipPath: "inset(0% 0% 100% 0%)" }
              : { clipPath: "inset(0% 0% 0% 0%)" }
          }
          transition={{ duration: duration.page, ease: ease.inOut }}
          onAnimationComplete={() => {
            if (phase === "covering") onCovered();
            else if (phase === "revealing") onRevealed();
          }}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: phase === "revealing" ? 0 : 1, scale: 1 }}
            transition={{ duration: duration.page, ease: ease.expo }}
            className="text-gold-light"
          >
            <HomMark className="h-14 w-auto" />
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
