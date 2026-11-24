"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-hairline first:border-t", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex min-h-14 flex-1 items-center justify-between gap-6 py-5 text-left font-heading text-lg font-bold tracking-tight text-ink",
          className
        )}
        {...props}
      >
        {children}
        <Plus
          size={20}
          aria-hidden="true"
          className="shrink-0 text-ink transition-transform duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:text-accent-deep"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-ink-soft data-[state=closed]:animate-[accordion-up_0.2s_ease] data-[state=open]:animate-[accordion-down_0.2s_ease]",
        className
      )}
      {...props}
    >
      <div className="max-w-2xl pb-6 text-base leading-relaxed">{children}</div>
    </AccordionPrimitive.Content>
  );
}
