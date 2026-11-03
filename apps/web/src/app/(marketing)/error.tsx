"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ui } from "@/content/ui";

/** Branded error boundary for marketing routes. */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      data-surface="dark"
      className="grain relative flex min-h-svh flex-col items-center justify-center gap-6 bg-ink px-(--gutter) text-center text-ivory"
    >
      <Eyebrow>{ui.error.eyebrow}</Eyebrow>
      <h1 className="display text-section">{ui.error.title}</h1>
      <p className="max-w-md font-serif text-lede text-bone/80 italic">{ui.error.text}</p>
      <Button size="lg" onClick={reset} arrow>
        {ui.error.retry}
      </Button>
    </section>
  );
}
