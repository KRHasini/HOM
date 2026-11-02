/** Brand icons drawn as simple line glyphs (lucide-react no longer ships brand marks). */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8Z" />
      <path d="m10 15 5.2-3L10 9v6Z" fill="currentColor" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2l-4.5 1.3Z" />
      <path
        d="M9.2 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.5.9 1.4 1.8 2.4 2.3.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.4.4 0 .5-.2 1.2-.7 1.6-.5.4-1.4.7-2.5.4-1.6-.4-3.4-1.8-4.4-3.1-.9-1.1-1.4-2.4-1.3-3.4 0-.6.3-1.1.5-1.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
