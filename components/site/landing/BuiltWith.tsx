const STACK = [
  'Hybrid Retrieval',
  'PPO',
  'FastAPI',
  'Gemini',
  'WhisperX',
  'pgvector',
];

export function BuiltWith() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1 font-mono text-xs tracking-wide text-fd-muted-foreground uppercase">
          Built with
        </span>
        {STACK.map((tech) => (
          <span
            key={tech}
            className="nb-box px-3 py-1 font-mono text-sm text-fd-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
