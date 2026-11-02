"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("hairline-b", className)} {...props} />;
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & { children: ReactNode }) {
  return (
    <AccordionPrimitive.Header asChild>
      <h3>
        <AccordionPrimitive.Trigger
          className={cn(
            "group/trigger flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left",
            "font-serif text-[1.375rem] leading-snug md:text-[1.625rem]",
            "transition-colors duration-300 hover:text-gold-light in-data-[surface=light]:hover:text-gold-deep",
            className,
          )}
          {...props}
        >
          <span>{children}</span>
          <span
            aria-hidden="true"
            className="relative grid size-10 shrink-0 place-items-center rounded-full border border-current/25 transition-colors duration-300 group-hover/trigger:border-gold-light"
          >
            <span className="absolute h-px w-3.5 bg-current" />
            <span className="absolute h-3.5 w-px bg-current transition-transform duration-500 ease-expo group-data-[state=open]/trigger:scale-y-0" />
          </span>
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_350ms_var(--ease-in-out)] data-[state=open]:animate-[accordion-down_450ms_var(--ease-expo)]"
      {...props}
    >
      <div className={cn("max-w-3xl pb-8 text-current/75", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
