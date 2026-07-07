export function CatMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 bg-contain bg-center bg-no-repeat"
      style={{
        width: size,
        height: size,
        backgroundImage: 'url(/cat.svg)',
      }}
    />
  );
}
