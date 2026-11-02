/** Self-hosted Google fonts via next/font (downloaded at build, no runtime requests). */
import { Anton, Cormorant_Garamond, Manrope, Mrs_Saint_Delafield } from "next/font/google";

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-anton",
  fallback: ["Bebas Neue", "Impact", "Arial Narrow", "sans-serif"],
});

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const cormorant = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  preload: false,
});

/** Script accent — used once or twice at most (the signature line). */
export const script = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
  preload: false,
});

export const fontVariables = [
  anton.variable,
  manrope.variable,
  cormorant.variable,
  script.variable,
].join(" ");
