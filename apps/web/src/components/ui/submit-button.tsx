"use client";

import { AnimatePresence, m } from "motion/react";

import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ArrowIcon } from "./arrow-icon";
import { buttonVariants } from "./button";

export type SubmitState = "idle" | "loading" | "success" | "error";

interface SubmitButtonProps {
  state: SubmitState;
  labels: { idle: string; loading: string; success: string };
  className?: string;
  disabled?: boolean;
}

/** Primary submit with loading, success (animated check) and error states. */
export function SubmitButton({ state, labels, className, disabled }: SubmitButtonProps) {
  const busy = state === "loading";
  return (
    <button
      type="submit"
      disabled={disabled || busy || state === "success"}
      aria-busy={busy}
      className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-w-56", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={state === "error" ? "idle" : state}
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: duration.micro, ease: ease.expo }}
        >
          {state === "loading" ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
              />
              {labels.loading}
            </>
          ) : state === "success" ? (
            <>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
                <m.path
                  d="M4 12.5 9.5 18 20 6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: ease.expo, delay: 0.05 }}
                />
              </svg>
              {labels.success}
            </>
          ) : (
            <>
              {labels.idle}
              <ArrowIcon className="w-5 transition-transform duration-500 ease-expo group-hover/button:translate-x-1.5" />
            </>
          )}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
