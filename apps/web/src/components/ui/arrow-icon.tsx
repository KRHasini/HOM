import { cn } from "@/lib/utils";

/** Long, thin editorial arrow used on CTAs and cards. */
export function ArrowIcon({
  className,
  direction = "right",
}: {
  className?: string;
  direction?: "right" | "up-right" | "left";
}) {
  return (
    <svg
      viewBox="0 0 24 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "h-auto",
        direction === "up-right" && "-rotate-45",
        direction === "left" && "rotate-180",
        className,
      )}
    >
      <path d="M1 6h21M17 1l5 5-5 5" />
    </svg>
  );
}
