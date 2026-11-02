/**
 * Security headers applied to every route (see next.config.ts).
 * Third-party origins are added only when the matching feature is configured.
 */

interface CspOptions {
  isDev: boolean;
  /**
   * The site is served over HTTPS. Only then may we force-upgrade subresources and send
   * HSTS — on plain-HTTP hosts (e.g. a local production build) Safari would otherwise
   * rewrite every asset to https:// and the page loads without CSS or JavaScript.
   */
  https: boolean;
  apiUrl?: string;
  analytics: boolean;
  turnstile: boolean;
}

function origin(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function contentSecurityPolicy({
  isDev,
  https,
  apiUrl,
  analytics,
  turnstile,
}: CspOptions): string {
  const ga = analytics
    ? ["https://www.googletagmanager.com", "https://*.google-analytics.com"]
    : [];
  const cf = turnstile ? ["https://challenges.cloudflare.com"] : [];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Next.js inlines bootstrap scripts; nonces would force every page to be dynamic.
    "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...ga, ...cf],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https://i.ytimg.com", ...ga],
    "font-src": ["'self'", "data:"],
    "media-src": ["'self'", "blob:"],
    "connect-src": [
      "'self'",
      ...(origin(apiUrl) ? [origin(apiUrl)!] : []),
      ...ga,
      ...(isDev ? ["ws:", "wss:"] : []),
    ],
    "frame-src": ["https://www.youtube-nocookie.com", "https://www.google.com", ...cf],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    ...(https ? { "upgrade-insecure-requests": [] } : {}),
  };

  return Object.entries(directives)
    .map(([key, values]) => [key, ...values].join(" "))
    .join("; ");
}

export function securityHeaders(options: CspOptions) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
    ...(options.https
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]
      : []),
  ];
}
