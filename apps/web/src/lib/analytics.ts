/**
 * Thin analytics wrapper. `track()` is a no-op unless a GA4 measurement id is configured
 * AND (when consent is required) the visitor accepted the cookie notice.
 */
import { publicEnv } from "./env";

export type AnalyticsEvent =
  | "trial_form_started"
  | "trial_step_completed"
  | "trial_submitted"
  | "contact_submitted"
  | "whatsapp_click"
  | "call_click"
  | "map_click"
  | "class_viewed"
  | "cta_click"
  | "instagram_click"
  | "youtube_click";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "hom-consent";
export type ConsentState = "granted" | "denied";

// Fallback when storage is blocked, so a decision still applies for this visit.
let memoryConsent: ConsentState | null = null;

export function getConsent(): ConsentState | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : memoryConsent;
  } catch {
    return memoryConsent;
  }
}

export function setConsent(value: ConsentState): void {
  memoryConsent = value;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // storage unavailable — the in-memory decision applies for this visit
  }
}

export function analyticsEnabled(): boolean {
  return (
    typeof window !== "undefined" && Boolean(publicEnv.gaId) && typeof window.gtag === "function"
  );
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (!analyticsEnabled()) return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  window.gtag?.("event", event, clean);
}
