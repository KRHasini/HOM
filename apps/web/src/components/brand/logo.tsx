import Link from "next/link";

import { cn } from "@/lib/utils";

import { HomMark } from "./hom-mark";

interface LogoProps {
  /** Supplied logo file (public/brand/...) when present; the coded wordmark otherwise. */
  src?: string | null;
  name: string;
  shortName: string;
  size?: "sm" | "lg";
  className?: string;
  href?: string;
}

/**
 * HOM wordmark: heavy Anton letters with the leaping-figure ring as the "O", a thin
 * rule, then the full studio name — mirroring the supplied logo's structure.
 */
export function Logo({ src, name, shortName, size = "sm", className, href = "/" }: LogoProps) {
  const [first = "H", , last = "M"] = shortName.split("");
  const large = size === "lg";

  const content = src ? (
    // eslint-disable-next-line @next/next/no-img-element -- SVG logo, sized by CSS
    <img src={src} alt={name} className={cn(large ? "h-24" : "h-10", "w-auto")} />
  ) : (
    <span className="flex flex-col items-center leading-none">
      <span
        className={cn(
          "flex items-center display",
          large ? "gap-[0.08em] text-[5.5rem] md:text-[8rem]" : "gap-[0.06em] text-[1.9rem]",
        )}
        aria-hidden="true"
      >
        <span>{first}</span>
        <HomMark className="h-[0.74em] text-gold-light" />
        <span>{last}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn("block h-px w-full bg-current opacity-60", large ? "my-3" : "my-1")}
      />
      <span
        aria-hidden="true"
        className={cn(
          "font-sans font-semibold whitespace-nowrap uppercase",
          large
            ? "text-[0.8rem] tracking-[0.42em] md:text-base"
            : "text-[0.42rem] tracking-[0.34em]",
        )}
      >
        {name}
      </span>
      <span className="sr-only">{name}</span>
    </span>
  );

  if (!href) return <span className={className}>{content}</span>;
  return (
    <Link href={href} className={cn("inline-flex", className)} aria-label={`${name} — home`}>
      {content}
    </Link>
  );
}
