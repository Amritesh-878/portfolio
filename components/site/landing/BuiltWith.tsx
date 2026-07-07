const STACK = [
  'Python',
  'FastAPI',
  'Next.js',
  'Gemini',
  'PostgreSQL',
  'Docker',
];

export function BuiltWith() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-fd-border py-3">
        <span className="font-mono text-xs tracking-wide text-fd-muted-foreground uppercase">
          Built with
        </span>
        <div className="flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs text-fd-foreground/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
