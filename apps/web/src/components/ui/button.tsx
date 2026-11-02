import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ArrowIcon } from "./arrow-icon";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden",
    "text-center font-sans text-[0.8125rem] font-semibold tracking-[0.16em] text-balance uppercase sm:whitespace-nowrap",
    "transition-[color,background-color,border-color,box-shadow] duration-300 ease-expo",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Gold fill, ink text — the key CTA. */
        primary:
          "bg-gold px-7 text-ink hover:bg-gold-light hover:shadow-[0_0_40px_-8px_var(--gold-light)]",
        /** Outlined; adapts to the surface it sits on. */
        secondary:
          "border border-current/40 px-7 text-current hover:border-gold-light hover:text-gold-light",
        /** Ink fill for light surfaces. */
        ink: "bg-ink px-7 text-ivory hover:bg-ink-soft",
        /** Text link with an animated underline. */
        ghost: "min-h-0 link-underline px-0 pb-1 tracking-[0.18em]",
      },
      size: {
        md: "min-h-12 py-3",
        lg: "min-h-14 py-3 md:px-9",
        auto: "",
      },
    },
    compoundVariants: [{ variant: "ghost", className: "min-h-0 py-0 pb-1" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

interface CommonProps extends Variants {
  children: ReactNode;
  className?: string;
  /** Trailing arrow that slides on hover. */
  arrow?: boolean;
  icon?: ReactNode;
}

function Inner({ children, arrow, icon }: Pick<CommonProps, "children" | "arrow" | "icon">) {
  return (
    <>
      {icon ? <span className="shrink-0 [&>svg]:size-5">{icon}</span> : null}
      <span className="relative">{children}</span>
      {arrow ? (
        <ArrowIcon className="w-5 shrink-0 transition-transform duration-500 ease-expo group-hover/button:translate-x-1.5" />
      ) : null}
    </>
  );
}

export function Button({
  variant,
  size,
  className,
  arrow,
  icon,
  children,
  type = "button",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Internal routes use next/link; tel:, mailto: and external URLs use a plain anchor. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  arrow,
  icon,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const inner = (
    <Inner arrow={arrow} icon={icon}>
      {children}
    </Inner>
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...props}>
        {inner}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {inner}
    </a>
  );
}
