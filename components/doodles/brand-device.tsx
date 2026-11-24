/**
 * The ring + bolt from the logo, drawn as a large cropped graphic. Colour comes
 * from `currentColor` (set it with a text-* class + opacity). Decorative only.
 */
export function BrandDevice({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="21" cy="21" r="17.25" stroke="currentColor" strokeWidth="3" />
      <path d="M23 6 L14 21 L21 21 L18 36 L29 19 L21 19 Z" fill="currentColor" />
    </svg>
  );
}

/** The bolt alone, for use as a small separator glyph. */
export function BoltGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="12 4 19 34" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M23 6 L14 21 L21 21 L18 36 L29 19 L21 19 Z" />
    </svg>
  );
}
