/**
 * Motion language constants (spec §8). Every animation in the site reads from here so
 * timing feels like one choreography. Mirrors the easing tokens in tokens.css.
 */

export const ease = {
  /** Expressive entrance curve. */
  expo: [0.22, 1, 0.36, 1],
  /** Symmetric transition curve. */
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  micro: 0.2,
  reveal: 0.8,
  revealSlow: 1.1,
  page: 0.35, // each half of the curtain; full transition < 700ms
  heroIntro: 1.8,
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.075,
  loose: 0.09,
} as const;

export const distance = {
  rise: 24,
} as const;

export const viewport = {
  /** Animate once on first view only — never replay on scroll back. */
  once: true,
  amount: 0.25,
  margin: "0px 0px -8% 0px",
} as const;
