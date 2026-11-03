import Link from "next/link";

import { brand } from "@/content/brand.config";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  /** `light` = ivory logo for dark surfaces; `dark` = ink logo for light surfaces. */
  tone?: "light" | "dark";
  size?: "sm" | "lg";
  className?: string;
  /** Link target; pass `null` to render the logo without a link. */
  href?: string | null;
}

/** The official House of Movements lockup (HOM with the dancer, rule, full name). */
export function Logo({ name, tone = "light", size = "sm", className, href = "/" }: LogoProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- vector logo, sized by CSS
    <img
      src={tone === "light" ? brand.logo.white : brand.logo.black}
      alt={href ? `${name} — home` : name}
      width={brand.logo.size.width}
      height={brand.logo.size.height}
      decoding="async"
      className={cn("w-auto", size === "lg" ? "h-28 md:h-40" : "h-12 md:h-16")}
    />
  );

  if (!href) return <span className={cn("inline-flex", className)}>{image}</span>;
  return (
    <Link href={href} className={cn("inline-flex", className)}>
      {image}
    </Link>
  );
}
