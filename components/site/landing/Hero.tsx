import Link from 'next/link';

interface Metric {
  label: string;
  value: string;
}

const METRICS: Metric[] = [
  { label: 'Projects', value: '8' },
  { label: 'Research', value: '1' },
  { label: 'Deployments', value: '3' },
];

interface Door {
  verb: string;
  href: string;
  blurb: string;
}

const DOORS: Door[] = [
  {
    verb: 'Read',
    href: '/introduction',
    blurb: 'Project deep-dives, architecture, and the decisions behind them.',
  },
  {
    verb: 'Play',
    href: '/projects/hunter-wumpus/play',
    blurb: 'Hunter Wumpus: a PPO agent hunts you through fog of war.',
  },
  {
    verb: 'Ask',
    href: '/twin/chat',
    blurb: 'An AI twin that answers from a curated corpus of my real work.',
  },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-16 pb-10 sm:pt-20">
      <p className="font-mono text-xs tracking-[0.2em] text-fd-primary uppercase">
        AI / ML Engineer
      </p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-fd-foreground sm:text-5xl md:text-6xl">
        Documented
        <br />
        <span className="text-fd-primary">like a system.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
        I build RAG systems, train reinforcement-learning agents, and ship NLP.
        This whole site is my documentation: read the write-ups, play the game a
        paper was written about, or ask my AI twin.
      </p>

      <dl className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {METRICS.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-2">
            <dd className="font-display text-2xl font-bold text-fd-foreground">
              {metric.value}
            </dd>
            <dt className="font-mono text-xs tracking-wide text-fd-muted-foreground uppercase">
              {metric.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        {DOORS.map((door) => (
          <Link
            key={door.verb}
            href={door.href}
            className="nb-box group flex flex-col p-4"
          >
            <span className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-fd-foreground">
                {door.verb}
              </span>
              <span
                aria-hidden
                className="font-mono text-fd-muted-foreground transition-colors group-hover:text-fd-primary"
              >
                →
              </span>
            </span>
            <span className="mt-1.5 text-sm text-fd-muted-foreground">
              {door.blurb}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
