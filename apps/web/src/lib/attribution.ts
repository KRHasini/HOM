/**
 * First-touch attribution: UTM parameters, referrer and landing page are captured once
 * per session and sent silently with every lead.
 */

const KEY = "hom-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_page?: string;
}

const clip = (value: string | null | undefined, max: number) =>
  value ? value.slice(0, max) : undefined;

export function captureAttribution(location: Location = window.location): Attribution {
  const existing = readAttribution();
  if (existing.landing_page) return existing;

  const params = new URLSearchParams(location.search);
  const referrer =
    document.referrer && !document.referrer.startsWith(location.origin)
      ? document.referrer
      : undefined;
  const attribution: Attribution = {
    ...Object.fromEntries(UTM_KEYS.map((k) => [k, clip(params.get(k), 128)])),
    referrer: clip(referrer, 512),
    landing_page: clip(location.pathname + location.search, 512),
  };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(attribution));
  } catch {
    // storage unavailable (private mode) — attribution is best-effort
  }
  return attribution;
}

export function readAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
