/**
 * Public (browser-safe) environment. `NEXT_PUBLIC_*` values are inlined at build time,
 * so they must be referenced literally. Kept dependency-free: this module ships to
 * every page, so it must not pull a validation library into the critical bundle.
 */

function url(value: string | undefined, fallback: string): string {
  const candidate = value || fallback;
  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid URL in environment: "${candidate}"`);
  }
}

export const publicEnv = {
  siteUrl: url(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  apiUrl: url(process.env.NEXT_PUBLIC_API_URL, "http://localhost:8000"),
  mediaBaseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
} as const;

export const isProduction = process.env.NODE_ENV === "production";
