"use client";

import Image from "next/image";
import { useState } from "react";

import { YoutubeIcon } from "@/components/icons/social";
import { TrackedLink } from "@/components/layout/tracked-link";

interface YoutubeSectionProps {
  title: string;
  text: string;
  channelUrl?: string;
  ctaLabel: string;
  loadLabel: string;
  videoIds: string[];
}

/** Channel link plus click-to-load (privacy-enhanced) embeds — no YouTube JS until asked. */
export function YoutubeSection({
  title,
  text,
  channelUrl,
  ctaLabel,
  loadLabel,
  videoIds,
}: YoutubeSectionProps) {
  const [loaded, setLoaded] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 border border-hairline p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex items-start gap-6">
          <YoutubeIcon className="size-12 shrink-0 text-gold-light" />
          <div className="flex flex-col gap-2">
            <h2 className="display text-4xl">{title}</h2>
            <p className="max-w-md text-bone/75">{text}</p>
          </div>
        </div>
        {channelUrl ? (
          <TrackedLink
            href={channelUrl}
            event="youtube_click"
            params={{ location: "gallery" }}
            className="inline-flex min-h-12 w-fit items-center gap-3 bg-gold px-7 text-[0.8125rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-light"
          >
            {ctaLabel}
          </TrackedLink>
        ) : null}
      </div>

      {videoIds.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {videoIds.map((id) => (
            <li key={id} className="relative aspect-video overflow-hidden bg-ink-soft">
              {loaded.includes(id) ? (
                <iframe
                  className="absolute inset-0 size-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                  title={title}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  data-cursor="Play"
                  onClick={() => setLoaded((l) => [...l, id])}
                  className="group/yt absolute inset-0"
                  aria-label={loadLabel}
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="50vw"
                    unoptimized
                    className="object-cover opacity-80"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-16 place-items-center rounded-full bg-gold text-ink transition-transform group-hover/yt:scale-110">
                      ▶
                    </span>
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
