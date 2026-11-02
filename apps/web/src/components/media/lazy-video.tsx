"use client";

import { useEffect, useRef } from "react";

import { useAutoplayAllowed } from "@/lib/hooks/use-media-query";
import type { ResolvedVideo } from "@/lib/media";
import { cn } from "@/lib/utils";

interface LazyVideoProps {
  video: ResolvedVideo;
  className?: string;
  /** `inview`: autoplay while visible. `hover`: play on hover (desktop) or tap (touch). */
  mode?: "inview" | "hover";
  /** Fires once the first frame can play — used to cross-fade over a poster. */
  onReady?: () => void;
}

/**
 * Muted, inline, metadata-preloaded video that plays only while on screen and never
 * autoplays for reduced motion or data-saver visitors.
 */
export function LazyVideo({ video, className, mode = "inview", onReady }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  // Sources attach only when allowed, so nothing downloads for visitors who opted out.
  const allowed = useAutoplayAllowed();

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed || mode !== "inview") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowed, mode]);

  const hoverHandlers =
    mode === "hover"
      ? {
          onPointerEnter: () => void ref.current?.play().catch(() => undefined),
          onPointerLeave: () => ref.current?.pause(),
          onClick: () => {
            const el = ref.current;
            if (!el) return;
            if (el.paused) void el.play().catch(() => undefined);
            else el.pause();
          },
        }
      : {};

  return (
    <video
      ref={ref}
      className={cn("size-full object-cover", className)}
      poster={video.poster.exists ? video.poster.src : undefined}
      muted
      playsInline
      loop
      preload="metadata"
      aria-label={video.alt}
      onCanPlay={onReady}
      {...hoverHandlers}
    >
      {allowed && video.webm ? <source src={video.webm} type="video/webm" /> : null}
      {allowed ? <source src={video.src} type="video/mp4" /> : null}
      {video.captions ? (
        <track kind="captions" src={video.captions} srcLang="en" label="English" />
      ) : null}
    </video>
  );
}
