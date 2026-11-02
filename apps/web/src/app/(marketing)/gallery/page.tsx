import type { Metadata } from "next";

import { GalleryView } from "@/components/sections/gallery/gallery-view";
import { YoutubeSection } from "@/components/sections/gallery/youtube-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { getGallery, getPage, getSite, getUi } from "@/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("gallery");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/gallery" });

export default async function GalleryPage() {
  const site = getSite();
  const ui = getUi().gallery;
  const gallery = await getGallery();
  const hero = gallery.items.find((i) => i.kind === "image");

  return (
    <>
      <PageHero {...page.hero} image={hero?.kind === "image" ? hero.media : undefined} />
      <Section surface="ink" className="pt-12 md:pt-16">
        <div className="container-hom">
          <GalleryView items={gallery.items} categories={gallery.categories} labels={ui} />
        </div>
      </Section>
      <Section surface="ink-soft" labelledBy="youtube-title">
        <div className="container-hom" id="youtube-title">
          <YoutubeSection
            title={gallery.youtube.title}
            text={gallery.youtube.text}
            channelUrl={site.social.youtube}
            ctaLabel={ui.youtubeCta}
            loadLabel={ui.loadVideo}
            videoIds={gallery.youtube.featuredVideoIds}
          />
        </div>
      </Section>
    </>
  );
}
