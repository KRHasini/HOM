"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

import { type AnalyticsEvent, type AnalyticsParams, track } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  event: AnalyticsEvent;
  params?: AnalyticsParams;
  children: ReactNode;
}

/** Plain anchor (tel:, wa.me, social, maps) that fires an analytics event on click. */
export function TrackedLink({
  href,
  event,
  params,
  children,
  onClick,
  ...props
}: TrackedLinkProps) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
