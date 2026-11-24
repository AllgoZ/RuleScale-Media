"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * One button system.
 *  - accent : primary call to action (deep red fill, white text, AA contrast)
 *  - primary: ink fill (secondary emphasis on light backgrounds)
 *  - ghost  : outlined, for secondary actions
 *  - light  : paper fill, for use on ink backgrounds
 *  - link   : text link with an underline affordance, no box
 * All boxed variants meet a 44px minimum touch target.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-heading font-semibold tracking-tight transition-[color,background-color,border-color,translate,scale,box-shadow] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        accent: "bg-accent-deep text-white hover:-translate-y-0.5 hover:bg-ink hover:shadow-soft",
        primary: "bg-ink text-paper hover:-translate-y-0.5 hover:bg-accent-deep hover:shadow-soft",
        ghost:
          "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        light: "bg-paper text-ink hover:bg-white",
        link: "rounded-none text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep",
      },
      size: {
        default: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size: variant === "link" ? null : size, className }))}
      {...props}
    />
  );
}
