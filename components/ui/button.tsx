"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_24px_-8px_rgba(32,30,29,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_16px_32px_-10px_rgba(32,30,29,0.6)]",
        accent:
          "bg-accent text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(236,48,19,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_16px_32px_-10px_rgba(236,48,19,0.6)]",
        ghost: "border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-ink/[0.03]",
      },
      size: {
        default: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ConflictingDOMProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingDOMProps>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const MotionButton = motion.create("button");
const MotionSlot = motion.create(Slot);

export function Button({ className, variant, size, asChild, onMouseMove, onMouseLeave, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    if (!prefersReducedMotion && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * 0.25);
      y.set((event.clientY - rect.top - rect.height / 2) * 0.3);
    }
    onMouseMove?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    x.set(0);
    y.set(0);
    onMouseLeave?.(event);
  }

  const MotionComp = asChild ? MotionSlot : MotionButton;

  return (
    <MotionComp
      ref={ref}
      style={{ x, y }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
