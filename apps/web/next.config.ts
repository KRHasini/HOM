import { existsSync } from "node:fs";
import path from "node:path";

import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

import { securityHeaders } from "./src/lib/security/headers";

const isDev = process.env.NODE_ENV !== "production";

// One .env at the monorepo root serves web, api and docker compose. `forceReload`
// because Next has already loaded (and cached) the app-level env by this point.
loadEnvConfig(path.resolve(import.meta.dirname, "../.."), isDev, undefined, true);

/** Warn (never fail) when the owner's brand files have not been dropped in yet. */
function warnMissingBrandFiles() {
  const required = ["logo-black.svg", "logo-white.svg", "mark.svg", "og-default.jpg"];
  const dir = path.join(import.meta.dirname, "public", "brand");
  const missing = required.filter((file) => !existsSync(path.join(dir, file)));
  if (missing.length > 0) {
    console.warn(
      `\n[HOM] Missing brand files in public/brand/: ${missing.join(", ")}.\n` +
        "      The coded HOM wordmark placeholder is used until they are added.\n",
    );
  }
}
warnMissingBrandFiles();

const ONE_YEAR = 60 * 60 * 24 * 365;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(import.meta.dirname, "../.."),
  reactStrictMode: true,
  agentRules: false,
  poweredByHeader: false,
  transpilePackages: ["@hom/api-client"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    minimumCacheTTL: THIRTY_DAYS,
    deviceSizes: [640, 750, 828, 1080, 1280, 1600, 1920, 2400],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          isDev,
          apiUrl: process.env.NEXT_PUBLIC_API_URL,
          analytics: Boolean(process.env.NEXT_PUBLIC_GA_ID),
          turnstile: process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true",
        }),
      },
      {
        // Media files keep stable names so owners can replace them in place:
        // long cache + revalidation instead of `immutable`.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${THIRTY_DAYS}, stale-while-revalidate=${ONE_YEAR}`,
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${THIRTY_DAYS}, must-revalidate` },
        ],
      },
    ];
  },
};

export default nextConfig;
