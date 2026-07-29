import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryPill({
  label,
  href,
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) {
  const pillClassName = cn(
    "inline-flex items-center rounded-full border border-hairline px-3 py-1 font-hand text-sm text-accent transition-colors",
    href && "hover:border-accent/40",
    className
  );

  if (href) {
    return (
      <Link href={href} className={pillClassName}>
        {label}
      </Link>
    );
  }

  return <span className={pillClassName}>{label}</span>;
}
