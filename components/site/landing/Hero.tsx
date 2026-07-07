import Link from 'next/link';

interface Metric {
  label: string;
  value: string;
  href: string;
}

const METRICS: Metric[] = [
  { label: 'Projects', value: '8', href: '/projects' },
  { label: 'Publication', value: '1', href: '/research' },
  { label: 'Live systems', value: '3', href: '/architecture' },
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
    blurb: 'Architecture, design decisions, implementation notes.',
  },
  {
    verb: 'Play',
    href: '/projects/hunter-wumpus/play',
    blurb: 'Play against the PPO agent from my published paper.',
  },
  {
    verb: 'Ask',
    href: '/twin/chat',
    blurb: 'Query my work through a retrieval-grounded AI twin.',
  },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-5 pb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-fd-primary uppercase">
        AI / ML Engineer
      </p>
      <h1 className="mt-2 font-display text-4xl leading-[1.05] font-bold tracking-tight text-fd-foreground sm:text-5xl md:text-6xl">
        Documented
        <br />
        <span className="text-fd-primary">like a system.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
        I build RAG systems, reinforcement-learning agents, and production NLP.
        This site is the documentation: read the write-ups, play the game behind
        the paper, or ask my AI twin.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {METRICS.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="group flex items-baseline gap-2"
          >
            <span className="font-display text-2xl font-bold text-fd-foreground transition-colors group-hover:text-fd-primary">
              {metric.value}
            </span>
            <span className="font-mono text-xs tracking-wide text-fd-muted-foreground uppercase underline-offset-4 group-hover:underline">
              {metric.label}
            </span>
          </Link>
        ))}
      </div>

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
