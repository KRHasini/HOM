"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SubmitState } from "@/components/ui/submit-button";
import { type AnalyticsEvent, type AnalyticsParams, track } from "@/lib/analytics";
import {
  fetchFormToken,
  type LeadInput,
  newIdempotencyKey,
  submitLead,
  type SubmitResult,
} from "@/lib/leads";

export interface SubmissionMessages {
  genericError: string;
  networkError: string;
  rateLimited: string;
}

/** API field names (snake_case) → form field names. */
const FIELD_MAP: Record<string, string> = {
  class_slug: "classSlug",
  preferred_days: "preferredDays",
  preferred_time: "preferredTime",
};

/**
 * Shared lead-form plumbing: fetches the anti-spam timing token after mount, keeps one
 * idempotency key per form session, tracks analytics and maps API errors to copy.
 */
export function useLeadSubmission(messages: SubmissionMessages) {
  const token = useRef<string | null>(null);
  const idempotencyKey = useRef<string>("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    idempotencyKey.current = newIdempotencyKey();
    const load = () => void fetchFormToken().then((t) => (token.current = t));
    // Don't compete with first paint for bandwidth.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(load, 1200);
    return () => window.clearTimeout(id);
  }, []);

  const submit = useCallback(
    async (
      input: LeadInput,
      analytics: { event: AnalyticsEvent; params?: AnalyticsParams },
    ): Promise<SubmitResult & { fields?: Record<string, string> }> => {
      setState("loading");
      setError(null);
      const result = await submitLead(input, {
        formToken: token.current,
        idempotencyKey: idempotencyKey.current || newIdempotencyKey(),
      });

      if (result.ok) {
        setState("success");
        track(analytics.event, analytics.params);
        return result;
      }

      setState("error");
      setError(
        result.reason === "network"
          ? messages.networkError
          : result.reason === "rate_limited"
            ? messages.rateLimited
            : messages.genericError,
      );
      const fields = result.fieldErrors
        ? Object.fromEntries(
            Object.entries(result.fieldErrors).map(([k, v]) => [FIELD_MAP[k] ?? k, v]),
          )
        : undefined;
      return { ...result, fields };
    },
    [messages],
  );

  const reset = useCallback(() => {
    idempotencyKey.current = newIdempotencyKey();
    setState("idle");
    setError(null);
  }, []);

  return { state, error, submit, reset };
}
