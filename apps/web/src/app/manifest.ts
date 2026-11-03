import type { MetadataRoute } from "next";

import { brand } from "@/content/brand.config";
import { getSite } from "@/content";

export default function manifest(): MetadataRoute.Manifest {
  const site = getSite();
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: brand.colors.ink,
    theme_color: brand.colors.ink,
    icons: [
      { src: brand.logo.icon192, sizes: "192x192", type: "image/png" },
      { src: brand.logo.icon512, sizes: "512x512", type: "image/png" },
      { src: brand.logo.icon512, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
