import Link from 'next/link';

interface Work {
  verb: string;
  title: string;
  blurb: string;
  href: string;
}

const WORK: Work[] = [
  {
    verb: 'Play',
    title: 'Hunter Wumpus',
    blurb:
      'A PPO agent hunts you through fog of war. Playable here, with a guided tutorial, and the subject of a published paper.',
    href: '/projects/hunter-wumpus/play',
  },
  {
    verb: 'Question',
    title: 'AI Twin',
    blurb:
      'A retrieval-grounded chatbot that answers from a curated corpus of my work, with its retrieval trace on display.',
    href: '/twin/chat',
  },
  {
    verb: 'Inspect',
    title: 'System Architecture',
    blurb:
      'How the site, the retrieval pipeline, and the game backend fit together, drawn out in diagrams.',
    href: '/architecture',
  },
  {
    verb: 'Read',
    title: 'The Paper',
    blurb:
      'Adversarial reinforcement learning in a partially observable dungeon. The research behind the game.',
    href: '/research',
  },
];

export function FeaturedWork() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="font-display text-sm font-semibold tracking-wide text-fd-muted-foreground uppercase">
        Featured work
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {WORK.map((work) => (
          <Link
            key={work.title}
            href={work.href}
            className="nb-box group flex flex-col p-5"
          >
            <span className="inline-flex w-fit items-center rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2.5 py-0.5 font-mono text-[0.7rem] tracking-wide text-fd-primary uppercase">
              {work.verb}
            </span>
            <span className="mt-3 flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-fd-foreground">
                {work.title}
              </span>
              <span
                aria-hidden
                className="font-mono text-fd-muted-foreground transition-colors group-hover:text-fd-primary"
              >
                →
              </span>
            </span>
            <span className="mt-1.5 text-sm text-fd-muted-foreground">
              {work.blurb}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
