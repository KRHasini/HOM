import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { brand } from "@/content/brand.config";
import { site } from "@/content/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph card, generated at build from the brand logo and content. */
export default async function OpengraphImage() {
  const { colors, logo } = brand;
  const png = await readFile(path.join(process.cwd(), "public", logo.whitePng));
  const logoSrc = `data:image/png;base64,${png.toString("base64")}`;
  const logoHeight = 330;
  const logoWidth = Math.round((logoHeight * logo.size.width) / logo.size.height);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 80px",
        background: `radial-gradient(70% 90% at 85% 10%, rgba(217,178,106,0.28), transparent 70%), ${colors.ink}`,
        color: colors.ivory,
        fontFamily: "sans-serif",
      }}
    >
      <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 520 }}>
        <div style={{ width: 64, height: 2, background: colors.goldLight }} />
        <div
          style={{
            fontSize: 44,
            color: colors.goldLight,
            letterSpacing: 6,
            textTransform: "uppercase",
            lineHeight: 1.2,
          }}
        >
          {site.tagline}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.3 }}>{site.signature}</div>
        <div style={{ display: "flex", fontSize: 26, color: colors.bone }}>
          {`${site.closing} · ${site.phone.display}`}
        </div>
      </div>
    </div>,
    size,
  );
}
