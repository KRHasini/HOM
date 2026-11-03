/** Self-hosted Google fonts via next/font (downloaded at build, no runtime requests). */
import { Cormorant_Garamond, Manrope, Mrs_Saint_Delafield } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// Serif and script carry above-the-fold copy (hero ledes, the signature line), which is
// often the LCP element — so they are preloaded, and limited to the weights in use.
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

/** Script accent — used once or twice at most (the signature line). */
export const script = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
});

export const fontVariables = [
  manrope.variable,
  cormorant.variable,
  script.variable,
].join(" ");
