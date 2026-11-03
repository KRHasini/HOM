/**
 * Brand assets and tokens for TypeScript consumers (JSON-LD, OG images, theming).
 * Colors mirror src/styles/tokens.css — keep both in sync when changing the palette.
 */

export const brand = {
  /** Official HOM logo, vector-traced from the studio's artwork (public/brand/). */
  logo: {
    /** Ink lockup for light surfaces. */
    black: "/brand/logo-black.svg",
    /** Ivory lockup for dark surfaces. */
    white: "/brand/logo-white.svg",
    /** Raster lockups for consumers that need PNG (structured data, social cards). */
    blackPng: "/brand/logo-black.png",
    whitePng: "/brand/logo-white.png",
    /** The leaping dancer inside the "O" — used as a recolourable mask. */
    mark: "/brand/mark.svg",
    icon192: "/brand/icon-192.png",
    icon512: "/brand/icon-512.png",
    /** Intrinsic sizes (width × height) so images reserve space without layout shift. */
    size: { width: 1323, height: 1020 },
    markSize: { width: 511, height: 832 },
  },
  colors: {
    ink: "#2A2622",
    inkSoft: "#343029",
    ivory: "#F7F4EE",
    paper: "#FCFAF6",
    gold: "#B59B6D",
    goldLight: "#D8C6A4",
    goldDeep: "#75603B",
    bone: "#E7E1D6",
    muted: "#6A645B",
  },
  fonts: {
    display: "Cormorant Garamond",
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
  "western-hip-hop": { accent: "#E7E1D6", contrast: "#2A2622", onDark: "#E7E1D6" }, // monochrome, gold detail
  "free-style": { accent: "#C9795A", contrast: "#2A2622", onDark: "#D9917A" },
  contemporary: { accent: "#8E7C93", contrast: "#2A2622", onDark: "#A895AD" },
  bollywood: { accent: "#A8566F", contrast: "#F7F4EE", onDark: "#CE8CA0" },
  gymnastics: { accent: "#4C6E94", contrast: "#F7F4EE", onDark: "#8FAAC6" },
  bharatanatyam: { accent: "#7A3A34", contrast: "#F7F4EE", onDark: "#D8C6A4" }, // temple maroon with gold
  yoga: { accent: "#8A9A78", contrast: "#2A2622", onDark: "#8A9A78" }, // calm sage on cream
  zumba: { accent: "#A4AE6B", contrast: "#2A2622", onDark: "#A4AE6B" }, // energetic lime
} as const satisfies Record<string, { accent: string; contrast: string; onDark: string }>;

export type ClassAccentSlug = keyof typeof classAccents;
