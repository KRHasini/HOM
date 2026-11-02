"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { type ConsentState, getConsent, setConsent } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { ease } from "@/lib/motion";

interface AnalyticsConsentProps {
  gaId: string;
  requireConsent: boolean;
  copy: { text: string; accept: string; decline: string };
  privacyHref: string;
}

const CONSENT_EVENT = "hom-consent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Privacy-first analytics: GA4 loads only when an id is configured and (if required)
 * the visitor accepts. Also captures first-touch attribution for lead forms.
 */
export function AnalyticsConsent({
  gaId,
  requireConsent,
  copy,
  privacyHref,
}: AnalyticsConsentProps) {
  // "unknown" on the server and during hydration, then the stored choice.
  const consent = useSyncExternalStore<ConsentState | null | "unknown">(
    subscribe,
    getConsent,
    () => "unknown",
  );

  useEffect(() => {
    captureAttribution();
  }, []);

  if (!gaId) return null;

  const decide = (value: ConsentState) => {
    setConsent(value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const load = !requireConsent || consent === "granted";
  const showBanner = requireConsent && consent === null;

  return (
    <>
      {load ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      <AnimatePresence>
        {showBanner ? (
          <m.div
            role="region"
            aria-label="Cookie notice"
            className="fixed inset-x-4 bottom-[calc(var(--action-bar-h)+var(--safe-bottom)+0.75rem)] z-(--z-consent) md:right-auto md:bottom-6 md:left-6 md:max-w-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: ease.expo, delay: 1.2 }}
          >
            <div className="border border-hairline bg-ink-soft/95 p-5 text-sm text-bone shadow-2xl backdrop-blur-xl">
              <p>
                {copy.text}{" "}
                <Link href={privacyHref} className="link-underline text-ivory">
                  Privacy
                </Link>
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="md" onClick={() => decide("granted")}>
                  {copy.accept}
                </Button>
                <Button size="md" variant="secondary" onClick={() => decide("denied")}>
                  {copy.decline}
                </Button>
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
