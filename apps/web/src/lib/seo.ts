import type { Metadata } from "next";

import type { Site } from "@/content/schema";

interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Use the title verbatim instead of applying the site title template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
}

/** Per-page metadata (title, description, canonical, Open Graph, Twitter) from content. */
export function buildMetadata(site: Site, page: PageSeo): Metadata {
  const url = new URL(page.path, site.url).toString();
  const images = page.image
    ? [
        {
          url: page.image.src,
          alt: page.image.alt,
          width: page.image.width,
          height: page.image.height,
        },
      ]
    : undefined;

  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      locale: site.locale,
      title: page.title,
      description: page.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(page.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
