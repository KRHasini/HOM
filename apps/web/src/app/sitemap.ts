import type { MetadataRoute } from "next";

import { getClasses, getSite, hasTestimonials } from "@/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSite();
  const [classes, showTestimonials] = await Promise.all([getClasses(), hasTestimonials()]);
  const url = (path: string) => new URL(path, site.url).toString();
  const now = new Date();

  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/classes", priority: 0.9, changeFrequency: "monthly" },
    { path: "/trial", priority: 0.9, changeFrequency: "monthly" },
    { path: "/instructors", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
    { path: "/events", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    ...(showTestimonials
      ? [{ path: "/testimonials", priority: 0.5, changeFrequency: "monthly" as const }]
      : []),
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map((p) => ({
      url: url(p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...classes.map((c) => ({
      url: url(c.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
