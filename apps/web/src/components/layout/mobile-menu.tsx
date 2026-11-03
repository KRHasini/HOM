"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Logo } from "@/components/brand/logo";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/social";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { duration, ease } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";

import { getLenis } from "../motion/smooth-scroll";

export interface MobileMenuProps {
  brand: { name: string };
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
  labels: { open: string; close: string };
  contact: { phoneDisplay: string; telHref: string; whatsappHref: string; email: string };
  social: { instagram?: string; youtube?: string };
  tagline: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full-screen menu with large type and a staggered link reveal. */
export function MobileMenu({
  brand,
  links,
  cta,
  labels,
  contact,
  social,
  tagline,
  open,
  onOpenChange,
}: MobileMenuProps) {
  const pathname = usePathname();

  // Pause smooth scroll while the menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        className="group/menu relative grid size-12 place-items-center lg:hidden"
        aria-label={labels.open}
      >
        <span className="flex w-7 flex-col items-end gap-[7px]" aria-hidden="true">
          <span className="h-px w-7 bg-ivory transition-all duration-500 ease-expo group-hover/menu:w-5" />
          <span className="h-px w-5 bg-ivory transition-all duration-500 ease-expo group-hover/menu:w-7" />
        </span>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Content
              forceMount
              aria-describedby={undefined}
              className="fixed inset-0 z-(--z-menu) focus:outline-none"
            >
              <m.div
                className="grain relative flex h-full flex-col overflow-y-auto surface-ink"
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                transition={{ duration: 0.6, ease: ease.inOut }}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="container-hom flex h-(--header-h) shrink-0 items-center justify-between">
                  <Logo name={brand.name} />
                  <Dialog.Close
                    className="group/close grid size-12 place-items-center"
                    aria-label={labels.close}
                  >
                    <span aria-hidden="true" className="relative block size-6">
                      <span className="absolute top-1/2 left-0 h-px w-6 rotate-45 bg-ivory transition-colors group-hover/close:bg-gold-light" />
                      <span className="absolute top-1/2 left-0 h-px w-6 -rotate-45 bg-ivory transition-colors group-hover/close:bg-gold-light" />
                    </span>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="container-hom flex-1 py-8">
                  <m.ul
                    className="flex flex-col"
                    initial="hidden"
                    animate="show"
                    variants={{
                      show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
                    }}
                  >
                    {links.map((link, i) => {
                      const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                      return (
                        <li key={link.href} className="overflow-hidden hairline-b">
                          <m.div
                            variants={{
                              hidden: { y: "100%" },
                              show: {
                                y: "0%",
                                transition: { duration: duration.reveal, ease: ease.expo },
                              },
                            }}
                          >
                            <Link
                              href={link.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group/link flex items-baseline justify-between gap-4 py-3",
                                active ? "text-gold-light" : "text-ivory",
                              )}
                            >
                              <span className="flex items-baseline gap-4">
                                <span className="eyebrow text-gold-light/80">{pad2(i + 1)}</span>
                                <span className="display text-[clamp(2.75rem,12vw,5rem)] leading-[1.05]">
                                  {link.label}
                                </span>
                              </span>
                              <ArrowIcon className="w-8 opacity-0 transition-all duration-500 ease-expo group-hover/link:translate-x-1 group-hover/link:opacity-100" />
                            </Link>
                          </m.div>
                        </li>
                      );
                    })}
                  </m.ul>
                </nav>

                <m.div
                  className="container-hom flex shrink-0 flex-col gap-6 pt-4 pb-[calc(2rem+var(--safe-bottom))]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.reveal, ease: ease.expo, delay: 0.55 }}
                >
                  <ButtonLink href={cta.href} arrow size="lg" className="w-full">
                    {cta.label}
                  </ButtonLink>
                  <div className="flex items-center justify-between gap-4">
                    <a
                      href={contact.telHref}
                      onClick={() => track("call_click", { location: "mobile_menu" })}
                      className="text-sm text-bone"
                    >
                      {contact.phoneDisplay}
                    </a>
                    <div className="flex items-center gap-1">
                      <a
                        href={contact.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        onClick={() => track("whatsapp_click", { location: "mobile_menu" })}
                        className="grid size-12 place-items-center text-bone hover:text-gold-light"
                      >
                        <WhatsappIcon className="size-5" />
                      </a>
                      {social.instagram ? (
                        <a
                          href={social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          onClick={() => track("instagram_click", { location: "mobile_menu" })}
                          className="grid size-12 place-items-center text-bone hover:text-gold-light"
                        >
                          <InstagramIcon className="size-5" />
                        </a>
                      ) : null}
                      {social.youtube ? (
                        <a
                          href={social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="YouTube"
                          onClick={() => track("youtube_click", { location: "mobile_menu" })}
                          className="grid size-12 place-items-center text-bone hover:text-gold-light"
                        >
                          <YoutubeIcon className="size-5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <p className="font-script text-3xl text-gold-light">{tagline}</p>
                </m.div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
