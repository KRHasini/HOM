/**
 * Public (browser-safe) environment, validated once. `NEXT_PUBLIC_*` values are inlined
 * at build time, so they must be referenced literally here.
 */
import { z } from "zod";

const PublicEnvSchema = z.object({
  siteUrl: z.url(),
  apiUrl: z.url(),
  mediaBaseUrl: z.string(),
  gaId: z.string(),
  turnstileSiteKey: z.string(),
});

export const publicEnv = PublicEnvSchema.parse({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  mediaBaseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
});

export const isProduction = process.env.NODE_ENV === "production";
