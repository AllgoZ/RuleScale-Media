import { cn } from "@/lib/utils";

export function PaperClip({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={cn("w-5 h-8 text-ink-soft drop-shadow-sm", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4V28C12 31.3137 9.31371 34 6 34C2.68629 34 0 31.3137 0 28V10C0 7.79086 1.79086 6 4 6C6.20914 6 8 7.79086 8 10V26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
