"use client";

import { useState } from "react";

import { LazyVideo } from "@/components/media/lazy-video";
import { SmartImage } from "@/components/media/smart-image";
import type { ResolvedVideo } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Hero backdrop. The poster frame paints instantly (preloaded LCP image), the looping
 * video fades in once it can play; without media, a slow ink-and-gold gradient mesh.
 */
export function HeroMedia({ video }: { video: ResolvedVideo }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {video.poster.exists ? (
        <SmartImage
          image={video.poster}
          sizes="100vw"
          preload
          quality={60}
          treatment="none"
          imageClassName="scale-105"
        />
      ) : (
        <GradientMesh />
      )}
      {video.exists ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-[1600ms] ease-expo",
            ready ? "opacity-100" : "opacity-0",
          )}
          data-stock={video.stock ? video.path : undefined}
        >
          <LazyVideo video={video} defer onReady={() => setReady(true)} className="scale-105" />
        </div>
      ) : null}
      {/* Darkening for legibility: vignette + bottom fade into the next scene. */}
      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_30%,var(--ink)_100%)] opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink via-ink/60 to-transparent" />
    </div>
  );
}

/** Animated ink-and-gold mesh (transform-only) with slow-moving light. */
export function GradientMesh() {
  return (
    <div className="absolute inset-0 bg-ink">
      <div
        className="absolute -inset-[20%] animate-mesh motion-reduce:animate-none"
        style={{
          background: [
            "radial-gradient(40% 35% at 30% 30%, color-mix(in oklab, var(--gold-light) 35%, transparent), transparent 70%)",
            "radial-gradient(35% 30% at 72% 62%, color-mix(in oklab, var(--gold) 28%, transparent), transparent 70%)",
            "radial-gradient(30% 25% at 50% 90%, color-mix(in oklab, var(--gold-deep) 25%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
    </div>
  );
}
