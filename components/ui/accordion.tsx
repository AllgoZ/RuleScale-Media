"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-hairline last:border-b-0", className)}
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
          "group flex flex-1 items-center justify-between gap-4 py-6 text-left font-heading text-lg font-bold text-ink",
          className
        )}
        {...props}
      >
        {children}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-ink-soft transition-transform duration-300 group-data-[state=open]:rotate-45 group-hover:text-ink"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 12C8 10.5 16 10.5 20 12"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12 4C10.5 8 10.5 16 12 20"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
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
        "overflow-hidden text-ink-soft data-[state=closed]:animate-[accordion-up_0.25s_ease] data-[state=open]:animate-[accordion-down_0.25s_ease]",
        className
      )}
      {...props}
    >
      <div className="pb-5 text-base leading-relaxed">{children}</div>
    </AccordionPrimitive.Content>
  );
}
