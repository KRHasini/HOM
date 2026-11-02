import { cn } from "@/lib/utils";

/**
 * Coded placeholder mark: a ring with an abstract leaping figure, echoing the dancer
 * inside the "O" of the HOM logo. Original vector — replaced by public/brand/mark.svg
 * when the owner supplies it.
 */
export function HomMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("aspect-square", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="32" r="29" strokeWidth="2.4" />
      <g strokeWidth="3.1">
        <path d="M34.5 23.5 Q31.5 29.5 29 34.5" />
        <path d="M29 34.5 Q38.5 36.5 49.5 32.5" />
        <path d="M29 34.5 Q21 38 14.5 45" />
        <path d="M33.2 26 Q41 21.5 47 14.5" />
        <path d="M33.2 26 Q25 24.5 18 27.5" />
      </g>
      <circle cx="36.6" cy="18.4" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
