import type { MetadataRoute } from "next";

import { getSite } from "@/content";

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
