"use client";

import { Phone } from "lucide-react";
import Link from "next/link";

import { WhatsappIcon } from "@/components/icons/social";
import { track } from "@/lib/analytics";

interface ActionBarProps {
  labels: { call: string; whatsapp: string; trial: string };
  telHref: string;
  whatsappHref: string;
  trialHref: string;
}

/**
 * Sticky bottom bar on phones: Call, WhatsApp and Book Trial. The footer reserves its
 * height (plus the iOS safe area) so it never covers content or the consent banner.
 */
export function ActionBar({ labels, telHref, whatsappHref, trialHref }: ActionBarProps) {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-(--z-action-bar) border-t border-hairline-soft bg-ink/90 pb-(--safe-bottom) backdrop-blur-xl md:hidden"
    >
      <ul className="grid h-(--action-bar-h) grid-cols-[1fr_1fr_1.4fr]">
        <li>
          <a
            href={telHref}
            onClick={() => track("call_click", { location: "action_bar" })}
            className="flex h-full items-center justify-center gap-2 text-xs font-semibold tracking-[0.14em] text-ivory uppercase"
          >
            <Phone aria-hidden="true" className="size-4 text-gold-light" strokeWidth={1.6} />
            {labels.call}
          </a>
        </li>
        <li className="border-l border-hairline-soft">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "action_bar" })}
            className="flex h-full items-center justify-center gap-2 text-xs font-semibold tracking-[0.14em] text-ivory uppercase"
          >
            <WhatsappIcon className="size-4 text-gold-light" />
            {labels.whatsapp}
          </a>
        </li>
        <li>
          <Link
            href={trialHref}
            onClick={() => track("cta_click", { location: "action_bar" })}
            className="flex h-full items-center justify-center bg-gold text-xs font-semibold tracking-[0.14em] text-ink uppercase"
          >
            {labels.trial}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
