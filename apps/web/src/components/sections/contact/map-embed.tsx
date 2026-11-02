"use client";

import { useState } from "react";

import { HomMark } from "@/components/brand/hom-mark";
import { TrackedLink } from "@/components/layout/tracked-link";
import { track } from "@/lib/analytics";

interface MapEmbedProps {
  embedUrl: string | null;
  mapLink: string;
  title: string;
  loadLabel: string;
  directionsLabel: string;
  address: string;
}

/**
 * Click-to-load map in a dark frame — no Google Maps code loads until requested, which
 * protects performance and privacy. Without an embed URL it links to Google Maps.
 */
export function MapEmbed({
  embedUrl,
  mapLink,
  title,
  loadLabel,
  directionsLabel,
  address,
}: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-hairline bg-ink-soft md:aspect-[21/9]">
      {loaded && embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 size-full grayscale-[0.6] hue-rotate-180 invert-[0.92]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 text-center">
          {/* Stylised map grid */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 size-full text-gold/15"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
          <span className="relative grid size-16 place-items-center rounded-full bg-gold text-ink shadow-[0_0_0_12px_color-mix(in_oklab,var(--gold)_20%,transparent)]">
            <HomMark className="size-9" />
          </span>
          <p className="relative max-w-sm text-bone/85">{address}</p>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            {embedUrl ? (
              <button
                type="button"
                onClick={() => {
                  setLoaded(true);
                  track("map_click", { action: "load_embed" });
                }}
                className="min-h-12 border border-bone/30 px-6 text-[0.8125rem] font-semibold tracking-[0.16em] text-ivory uppercase hover:border-gold-light"
              >
                {loadLabel}
              </button>
            ) : null}
            <TrackedLink
              href={mapLink}
              event="map_click"
              params={{ location: "contact_map" }}
              className="inline-flex min-h-12 items-center bg-gold px-6 text-[0.8125rem] font-semibold tracking-[0.16em] text-ink uppercase hover:bg-gold-light"
            >
              {directionsLabel}
            </TrackedLink>
          </div>
        </div>
      )}
    </div>
  );
}
