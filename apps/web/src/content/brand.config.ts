/**
 * Brand assets and tokens for TypeScript consumers (JSON-LD, OG images, theming).
 * Colors mirror src/styles/tokens.css — keep both in sync when changing the palette.
 */

export const brand = {
  logo: {
    // Drop the supplied logo files here; the coded wordmark is used until they exist.
    black: "/brand/logo-black.svg",
    white: "/brand/logo-white.svg",
    mark: "/brand/mark.svg",
    ogDefault: "/brand/og-default.jpg",
  },
  colors: {
    ink: "#0B0B0C",
    inkSoft: "#17171A",
    ivory: "#F6F1E8",
    paper: "#FBF8F2",
    gold: "#B8863B",
    goldLight: "#D9B26A",
    goldDeep: "#8A6224",
    bone: "#E4DCCB",
    muted: "#6B665D",
  },
  fonts: {
    display: "Anton",
    serif: "Cormorant Garamond",
    sans: "Manrope",
    script: "Mrs Saint Delafield",
  },
} as const;

/**
 * Per-class accents, derived from each class poster. `contrast` is the text color
 * that passes WCAG AA on the accent; `onDark` is the accent variant used for text and
 * marks on ink (≥ 3:1 for large display numerals). Accents only appear inside a
 * class's own context.
 */
export const classAccents = {
  "western-hip-hop": { accent: "#E4DCCB", contrast: "#0B0B0C", onDark: "#E4DCCB" }, // monochrome, gold detail
  "free-style": { accent: "#E4572E", contrast: "#0B0B0C", onDark: "#E4572E" },
  contemporary: { accent: "#8E7C93", contrast: "#0B0B0C", onDark: "#A895AD" },
  bollywood: { accent: "#C2185B", contrast: "#F6F1E8", onDark: "#E04A86" },
  gymnastics: { accent: "#3A6EA5", contrast: "#F6F1E8", onDark: "#6C9BD0" },
  bharatanatyam: { accent: "#7A1F1A", contrast: "#F6F1E8", onDark: "#D9B26A" }, // temple maroon with gold
  yoga: { accent: "#8A9A78", contrast: "#0B0B0C", onDark: "#8A9A78" }, // calm sage on cream
  zumba: { accent: "#A8B82F", contrast: "#0B0B0C", onDark: "#A8B82F" }, // energetic lime
} as const satisfies Record<string, { accent: string; contrast: string; onDark: string }>;

export type ClassAccentSlug = keyof typeof classAccents;
