"use client";

import { m } from "motion/react";

import { WhatsappIcon } from "@/components/icons/social";
import { track } from "@/lib/analytics";
import { ease } from "@/lib/motion";

/** Desktop floating WhatsApp button (bottom-right) with the prefilled message. */
export function WhatsappFab({ href, label }: { href: string; label: string }) {
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => track("whatsapp_click", { location: "floating_button" })}
      className="group/fab fixed right-6 bottom-6 z-(--z-sticky) hidden items-center gap-3 md:flex"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: ease.expo, delay: 2.2 }}
    >
      <span className="pointer-events-none translate-x-2 rounded-full bg-ink/85 px-4 py-2 eyebrow text-ivory opacity-0 backdrop-blur transition-all duration-500 ease-expo group-hover/fab:translate-x-0 group-hover/fab:opacity-100">
        {label}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-gold text-ink shadow-[0_10px_40px_-10px_rgb(184_134_59/0.7)] transition-transform duration-500 ease-expo group-hover/fab:scale-105">
        <WhatsappIcon className="size-6" />
      </span>
    </m.a>
  );
}
