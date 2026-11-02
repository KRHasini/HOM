"use client";

import { useEffect, useState } from "react";

interface Slot {
  path: string;
  kind: string;
}

/**
 * Dev-only overlay (append ?placeholders=1 to any URL) listing every media slot on the
 * page that still shows a placeholder or a stock stand-in.
 */
export function PlaceholderOverlay() {
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("placeholders")) return;
    const collect = () => {
      const found = new Map<string, Slot>();
      document.querySelectorAll<HTMLElement>("[data-placeholder],[data-stock]").forEach((el) => {
        const path = el.dataset.placeholder || el.dataset.stock || "unknown";
        el.style.outline = "2px dashed var(--gold-light)";
        found.set(path, { path, kind: el.dataset.placeholder ? "missing" : "stock" });
      });
      setSlots([...found.values()]);
    };
    const id = window.setTimeout(collect, 800);
    return () => window.clearTimeout(id);
  }, []);

  if (!slots) return null;
  return (
    <aside className="fixed top-24 right-4 z-(--z-cursor) max-h-[70vh] w-80 overflow-auto border border-hairline bg-ink/95 p-4 text-xs text-bone shadow-2xl">
      <p className="mb-3 eyebrow text-gold-light">Media slots to replace ({slots.length})</p>
      <ul className="flex flex-col gap-2">
        {slots.map((s) => (
          <li key={s.path} className="flex justify-between gap-3">
            <code className="break-all">{s.path}</code>
            <span className={s.kind === "missing" ? "text-error-dark" : "text-gold-light"}>
              {s.kind}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
