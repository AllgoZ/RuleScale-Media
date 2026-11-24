// Brand mark: claude files/logo2.png, served from /public/logo.png.
// `inverted` is kept for call-site compatibility; the mark is the same on light and dark surfaces.
export function LogoMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
  inverted?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static brand asset, no optimizer needed
    <img
      src="/logo.png"
      width={size}
      height={size}
      alt="RuleScale Media logo"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
