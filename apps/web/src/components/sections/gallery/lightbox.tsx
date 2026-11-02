"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { getLenis } from "@/components/motion/smooth-scroll";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { ResolvedGalleryItem } from "@/content";
import { ease } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

interface LightboxProps {
  items: ResolvedGalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: { close: string; previous: string; next: string };
}

const SWIPE_THRESHOLD = 50;

/** Full-screen viewer: arrow keys, swipe, focus trap and Escape to close (Radix Dialog). */
export function Lightbox({ items, index, onIndexChange, onClose, labels }: LightboxProps) {
  const item = items[index];
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + items.length) % items.length),
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, []);

  if (!item) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-menu) bg-ink/95 backdrop-blur-md" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-(--z-menu) flex flex-col text-ivory outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          onPointerDown={(e) => (touchX.current = e.clientX)}
          onPointerUp={(e) => {
            if (touchX.current === null) return;
            const dx = e.clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
          }}
        >
          <Dialog.Title className="sr-only">{item.caption}</Dialog.Title>
          <div className="container-hom flex h-(--header-h) shrink-0 items-center justify-between">
            <span className="eyebrow text-bone/70">
              {pad2(index + 1)} / {pad2(items.length)}
            </span>
            <Dialog.Close className="grid min-h-12 place-items-center px-2 eyebrow text-bone hover:text-gold-light">
              {labels.close} ✕
            </Dialog.Close>
          </div>

          <div className="relative flex-1 select-none">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={item.id}
                className="absolute inset-0 px-4 pb-4 md:px-24"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: ease.expo }}
              >
                <div className="relative size-full">
                  {item.kind === "image" ? (
                    <Image
                      src={item.media.src}
                      alt={item.media.alt}
                      fill
                      sizes="100vw"
                      quality={85}
                      className="object-contain"
                      placeholder={item.media.blurDataURL ? "blur" : "empty"}
                      blurDataURL={item.media.blurDataURL}
                    />
                  ) : (
                    <video
                      key={item.media.src}
                      className="size-full object-contain"
                      controls
                      autoPlay
                      muted
                      playsInline
                      poster={item.media.poster.src}
                      aria-label={item.media.alt}
                    >
                      {item.media.webm ? <source src={item.media.webm} type="video/webm" /> : null}
                      <source src={item.media.src} type="video/mp4" />
                      {item.media.captions ? (
                        <track
                          kind="captions"
                          src={item.media.captions}
                          srcLang="en"
                          label="English"
                          default
                        />
                      ) : null}
                    </video>
                  )}
                </div>
              </m.div>
            </AnimatePresence>

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.previous}
                  className="absolute top-1/2 left-3 z-10 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-bone/25 bg-ink/50 hover:border-gold-light md:grid"
                >
                  <ArrowIcon direction="left" className="w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="absolute top-1/2 right-3 z-10 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-bone/25 bg-ink/50 hover:border-gold-light md:grid"
                >
                  <ArrowIcon className="w-5" />
                </button>
              </>
            ) : null}
          </div>

          <p className="container-hom shrink-0 py-6 text-center eyebrow text-bone/80">
            {item.caption}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
