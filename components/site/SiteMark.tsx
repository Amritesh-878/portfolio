// An abstract mark in the two site accents: a gold block (the treasure) and a
// pit-red disc (the pit) overlapping. Decorative; the name/label carries meaning.
export function SiteMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect
        x="3"
        y="6"
        width="12"
        height="12"
        rx="2.5"
        fill="var(--color-fd-primary)"
      />
      <circle
        cx="15.5"
        cy="14"
        r="6"
        fill="var(--color-accent-red)"
        fillOpacity="0.82"
      />
    </svg>
  );
}
