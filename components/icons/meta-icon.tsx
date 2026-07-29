export function MetaIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Meta"
    >
      <path
        d="M8 24.5c0-8.6 4.6-15 11-15 3.6 0 6.4 2.1 9 5.9 2.6-3.8 5.4-5.9 9-5.9 6.4 0 11 6.4 11 15s-4.6 15-11 15c-3.6 0-6.4-2.1-9-5.9-2.6 3.8-5.4 5.9-9 5.9-6.4 0-11-6.4-11-15Z"
        stroke="url(#meta-gradient)"
        strokeWidth="4.2"
      />
      <defs>
        <linearGradient id="meta-gradient" x1="8" y1="24.5" x2="40" y2="24.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0082FB" />
          <stop offset="0.5" stopColor="#0064E0" />
          <stop offset="1" stopColor="#0082FB" />
        </linearGradient>
      </defs>
    </svg>
  );
}
