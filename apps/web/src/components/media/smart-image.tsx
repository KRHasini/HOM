import Image from "next/image";

import type { ResolvedImage } from "@/lib/media";
import { cn } from "@/lib/utils";

import { MediaPlaceholder } from "./media-placeholder";

interface SmartImageProps {
  image: ResolvedImage;
  /** Responsive `sizes` hint — always set for fill images. */
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Preload above-the-fold images (the LCP candidate). */
  preload?: boolean;
  treatment?: "editorial" | "duotone" | "monochrome" | "none";
  accent?: string;
  quality?: 60 | 75 | 85;
}

/**
 * next/image with blur-up, focal point and the HOM imagery treatment. Falls back to the
 * art-directed MediaPlaceholder automatically when the file has not been added yet.
 * Always fills its (positioned, sized) parent — no layout shift.
 */
export function SmartImage({
  image,
  sizes,
  className,
  imageClassName,
  preload = false,
  treatment = "editorial",
  accent,
  quality = 75,
}: SmartImageProps) {
  if (!image.exists) {
    return (
      <MediaPlaceholder
        motif={image.motif}
        path={image.path}
        label={image.alt}
        accent={accent}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        treatment === "duotone" && "duotone",
        className,
      )}
      data-stock={image.stock ? image.path : undefined}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
        className={cn(
          "object-cover",
          treatment === "editorial" && "editorial",
          treatment === "monochrome" && "contrast-[1.1] grayscale",
          imageClassName,
        )}
        style={image.focal ? { objectPosition: image.focal } : undefined}
      />
    </div>
  );
}
