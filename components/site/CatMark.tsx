// Rounded square, not a circle: a circle crops the cat's ears.
export function CatMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-md border-2 bg-white bg-cover bg-center"
      style={{
        width: size,
        height: size,
        borderColor: 'var(--nb-line)',
        backgroundImage: 'url(/cat.jpg)',
      }}
    />
  );
}
