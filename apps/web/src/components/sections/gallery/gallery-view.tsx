"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { LazyVideo } from "@/components/media/lazy-video";
import { SmartImage } from "@/components/media/smart-image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ResolvedGalleryItem } from "@/content";
import type { GalleryCategory } from "@/content/schema";

const Lightbox = dynamic(() => import("./lightbox").then((m) => m.Lightbox), { ssr: false });

interface GalleryViewProps {
  items: ResolvedGalleryItem[];
  categories: { id: GalleryCategory; label: string }[];
  labels: {
    all: string;
    play: string;
    view: string;
    close: string;
    previous: string;
    next: string;
  };
}

const ALL = "all";

/** Masonry grid with category tabs; tiles open a keyboard- and swipe-friendly lightbox. */
export function GalleryView({ items, categories, labels }: GalleryViewProps) {
  const [tab, setTab] = useState<string>(ALL);
  const [open, setOpen] = useState<number | null>(null);
  const visible = useMemo(
    () => (tab === ALL ? items : items.filter((i) => i.category === tab)),
    [items, tab],
  );

  return (
    <>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          aria-label="Gallery categories"
          className="-mx-(--gutter) px-(--gutter) md:mx-0 md:px-0"
        >
          <TabsTrigger value={ALL}>{labels.all}</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((item, index) => {
          const poster = item.kind === "image" ? item.media : item.media.poster;
          const ratio = `${poster.width} / ${poster.height}`;
          return (
            <li key={item.id} className="break-inside-avoid">
              <figure className="group/tile relative">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  data-cursor={item.kind === "video" ? labels.play : labels.view}
                  aria-label={`${item.kind === "video" ? labels.play : labels.view}: ${item.caption}`}
                  className="relative block w-full overflow-hidden rounded-xs bg-ink-soft"
                  style={{
                    aspectRatio:
                      item.kind === "video" ? `${item.media.width} / ${item.media.height}` : ratio,
                  }}
                >
                  {item.kind === "video" ? (
                    <span className="absolute inset-0">
                      <LazyVideo video={item.media} mode="hover" />
                      <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1 eyebrow text-ivory backdrop-blur">
                        ▶ {labels.play}
                      </span>
                    </span>
                  ) : (
                    <span className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover/tile:scale-105">
                      <SmartImage
                        image={item.media}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
                  />
                </button>
                <figcaption className="pointer-events-none absolute bottom-4 left-4 eyebrow text-ivory opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100">
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {open !== null ? (
        <Lightbox
          items={visible}
          index={open}
          onIndexChange={setOpen}
          onClose={() => setOpen(null)}
          labels={labels}
        />
      ) : null}
    </>
  );
}
