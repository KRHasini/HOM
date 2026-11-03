# Brand files

The official House of Movements logo, vector-traced from the studio's artwork. Every
logo on the site (header, menu, footer, page transitions, favicon, app icons, social
card and structured data) comes from these files, referenced in
`src/content/brand.config.ts`.

| File                               | Used for                                                            |
| ---------------------------------- | ------------------------------------------------------------------- |
| `logo-white.svg`                   | Ivory lockup on dark surfaces (header, menu, footer)                |
| `logo-black.svg`                   | Ink lockup on light surfaces                                        |
| `logo-black.png`, `logo-white.png` | Raster lockups for structured data and the social card              |
| `mark.svg`                         | The dancer-in-the-"O" mark, recoloured in CSS (gold, ivory or ink)  |
| `icon-192.png`, `icon-512.png`     | App / home-screen icons (also `src/app/icon.svg`, `apple-icon.png`) |

To update the logo, replace these files keeping the same names and proportions
(lockup 1323 × 1020, mark 511 × 832 — or update `size` / `markSize` in `brand.config.ts`).
