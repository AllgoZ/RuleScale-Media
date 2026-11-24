import Link from "next/link";
import { cn } from "@/lib/utils";

/** Small category label. Plain text style (not a chip) so cards stay quiet. */
export function CategoryPill({
  label,
  href,
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) {
  const labelClassName = cn(
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep",
    href && "relative z-10 hover:underline",
    className
  );

  if (href) {
    return (
      <Link href={href} className={labelClassName}>
        {label}
      </Link>
    );
  }

  return <span className={labelClassName}>{label}</span>;
}
