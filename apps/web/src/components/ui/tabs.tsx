"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex min-h-12 shrink-0 items-center rounded-full border border-current/25 px-5 text-sm font-medium tracking-wide",
        "text-current/80 transition-[background-color,color,border-color] duration-300 ease-expo",
        "hover:border-gold-light hover:text-current",
        "data-[state=active]:border-gold data-[state=active]:bg-gold data-[state=active]:text-ink",
        className,
      )}
      {...props}
    />
  );
}
