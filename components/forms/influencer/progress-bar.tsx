"use client";

import { cn } from "@/lib/utils";
import { INFLUENCER_FORM_SECTIONS } from "./types";

export function ProgressBar({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          Step {step + 1} of {INFLUENCER_FORM_SECTIONS.length}
        </span>
        <span className="hidden sm:inline">{INFLUENCER_FORM_SECTIONS[step]}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {INFLUENCER_FORM_SECTIONS.map((section, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <button
              key={section}
              type="button"
              disabled={index > step}
              onClick={() => onStepClick(index)}
              aria-label={section}
              aria-current={active}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                done && "gradient-bg",
                active && "gradient-bg",
                !done && !active && "bg-hairline",
                index > step && "cursor-not-allowed"
              )}
            />
          );
        })}
      </div>
      <div className="mt-2 text-sm font-medium text-ink sm:hidden">{INFLUENCER_FORM_SECTIONS[step]}</div>
    </div>
  );
}
