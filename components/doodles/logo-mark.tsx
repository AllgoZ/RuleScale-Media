export function LogoMark({
  className,
  size = 32,
  inverted = false,
}: {
  className?: string;
  size?: number;
  inverted?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      className={className}
      role="img"
      aria-label="RuleScale Media logo mark"
    >
      <circle
        cx="21"
        cy="21"
        r="17.25"
        stroke={inverted ? "#f3f2f2" : "#201e1d"}
        strokeWidth="3"
      />
      <path d="M23 6 L14 21 L21 21 L18 36 L29 19 L21 19 Z" fill="#ec3013" />
    </svg>
  );
}
