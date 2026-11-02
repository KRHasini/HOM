"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { QUERIES, useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "hover" | "label";

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";

/**
 * Desktop-only cursor: a small dot that grows over interactive elements and shows a
 * label ("Play", "View") over elements with `data-cursor`. Never mounts on touch
 * devices or for reduced motion, so the native cursor is always preserved there.
 */
export function CustomCursor({ enabled }: { enabled: boolean }) {
  const finePointer = useMediaQuery(QUERIES.finePointer);
  const reducedMotion = useMediaQuery(QUERIES.reducedMotion);
  const active = enabled && finePointer && !reducedMotion;
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (!target) {
        setMode("default");
        return;
      }
      const text = (target as HTMLElement).dataset.cursor;
      if (text) {
        setLabel(text);
        setMode("label");
      } else {
        setMode("hover");
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [active, x, y]);

  if (!active) return null;

  const size = mode === "label" ? 84 : mode === "hover" ? 44 : 10;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-(--z-cursor)"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className={cn(
          "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
          mode === "label"
            ? "bg-gold text-ink"
            : mode === "hover"
              ? "border border-gold-light bg-gold/10"
              : "bg-gold-light",
        )}
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {mode === "label" ? (
          <span className="eyebrow text-[0.625rem] tracking-[0.18em]">{label}</span>
        ) : null}
      </m.div>
    </m.div>
  );
}
