// The site mark is Amritesh's GitHub avatar (a black cat). A rounded square keeps
// the ears from clipping the way a circle would; the hard border ties it to the
// neo-brutalist chrome and gives the light avatar an edge in dark mode.
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
