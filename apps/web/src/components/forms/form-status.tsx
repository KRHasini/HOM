"use client";

import { AnimatePresence, m } from "motion/react";

import { ease } from "@/lib/motion";

/** Polite live region for form errors (screen readers announce changes). */
export function FormStatus({
  error,
  whatsapp,
}: {
  error: string | null;
  whatsapp?: { href: string; label: string };
}) {
  return (
    <div aria-live="polite" role="status" className="min-h-6">
      <AnimatePresence>
        {error ? (
          <m.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.expo }}
            className="text-sm text-error-dark in-data-[surface=light]:text-error"
          >
            {error}{" "}
            {whatsapp ? (
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {whatsapp.label}
              </a>
            ) : null}
          </m.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
