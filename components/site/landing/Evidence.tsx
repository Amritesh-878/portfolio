interface Proof {
  headline: string;
  detail: string;
}

const PROOF: Proof[] = [
  { headline: '300+ students', detail: 'ran exams on tooling I shipped' },
  { headline: 'Published paper', detail: 'on the Hunter Wumpus RL agent' },
  { headline: 'Patent application', detail: 'filed from the same work' },
  { headline: 'RAG systems', detail: 'grounded, cited, in production' },
  { headline: 'RL agents', detail: 'PPO, trained from scratch' },
  {
    headline: 'Production automation',
    detail: 'pipelines that still run daily',
  },
];

export function Evidence() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PROOF.map((proof) => (
          <div key={proof.headline} className="nb-box p-4">
            <p className="font-display text-lg font-semibold text-fd-foreground">
              {proof.headline}
            </p>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              {proof.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
