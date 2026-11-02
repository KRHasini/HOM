import { ImageResponse } from "next/og";

import { brand } from "@/content/brand.config";
import { site } from "@/content/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph card, generated at build from content (no external fonts). */
export default function OpengraphImage() {
  const { colors } = brand;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `radial-gradient(70% 90% at 85% 10%, rgba(217,178,106,0.28), transparent 70%), ${colors.ink}`,
        color: colors.ivory,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: colors.goldLight,
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        <div style={{ width: 48, height: 2, background: colors.goldLight }} />
        {site.shortName} · {site.signature}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.9,
            textTransform: "uppercase",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 40,
            color: colors.goldLight,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          {site.tagline}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: colors.bone,
        }}
      >
        <span>{site.closing}</span>
        <span>{site.phone.display}</span>
      </div>
    </div>,
    size,
  );
}
