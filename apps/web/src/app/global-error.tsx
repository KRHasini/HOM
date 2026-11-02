"use client";

import "@/styles/globals.css";

import { ui } from "@/content/ui";

/** Last-resort boundary (replaces the root layout), so it renders its own <html>. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-6 bg-ink p-8 text-center text-ivory">
        <p className="eyebrow text-gold-light">{ui.error.eyebrow}</p>
        <h1 className="text-6xl font-bold uppercase">{ui.error.title}</h1>
        <p className="max-w-md">{ui.error.text}</p>
        <button
          type="button"
          onClick={reset}
          className="min-h-12 bg-gold px-7 font-semibold text-ink uppercase"
        >
          {ui.error.retry}
        </button>
      </body>
    </html>
  );
}
