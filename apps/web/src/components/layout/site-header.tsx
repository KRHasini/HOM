"use client";

import { m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Magnetic } from "@/components/motion/magnetic";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { MobileMenu, type MobileMenuProps } from "./mobile-menu";

export interface SiteHeaderProps {
  brand: { name: string };
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
  menu: Omit<MobileMenuProps, "links" | "cta" | "brand" | "open" | "onOpenChange">;
}

const SOLID_AFTER = 40;
const HIDE_AFTER = 160;

/**
 * Transparent over the hero, a blurred ink bar after scrolling. Hides on scroll down,
 * returns on scroll up.
 */
export function SiteHeader({ brand, links, cta, menu }: SiteHeaderProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the menu once the new route has rendered (behind the page curtain).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setSolid(latest > SOLID_AFTER);
    setHidden(latest > HIDE_AFTER && latest > previous && !menuOpen);
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-(--z-header)"
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease: ease.inOut }}
    >
      <div
        className={cn(
          "relative transition-[background-color,border-color,backdrop-filter] duration-500 ease-expo",
          "border-b",
          solid
            ? "border-hairline-soft bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-linear-to-b from-ink/55 to-transparent",
        )}
      >
        <div className="container-hom flex h-(--header-h) items-center justify-between gap-6">
          <Logo name={brand.name} className="text-ivory" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className="link-underline py-2 eyebrow text-ivory/85 transition-colors hover:text-ivory aria-[current=page]:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden md:inline-block">
              <ButtonLink
                href={cta.href}
                arrow
                onClick={() => track("cta_click", { location: "header" })}
              >
                {cta.label}
              </ButtonLink>
            </Magnetic>
            <MobileMenu
              {...menu}
              brand={brand}
              links={links}
              cta={cta}
              open={menuOpen}
              onOpenChange={setMenuOpen}
            />
          </div>
        </div>
      </div>
      <m.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: solid ? 0 : 1 }}
        transition={{ duration: duration.heroIntro, ease: ease.inOut, delay: 0.6 }}
      />
    </m.header>
  );
}
