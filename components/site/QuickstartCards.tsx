import Link from 'next/link';

interface QuickstartCard {
  href: string;
  title: string;
  description: string;
}

const CARDS: QuickstartCard[] = [
  {
    href: '/twin/chat',
    title: 'Talk to my AI twin',
    description:
      'A retrieval-augmented chatbot grounded in a curated corpus, with its retrieval trace on display.',
  },
  {
    href: '/projects/hunter-wumpus/play',
    title: 'Play my RL game',
    description:
      'Hunter Wumpus: a trained agent hunts you through a dungeon. The subject of a published paper.',
  },
  {
    href: '/projects',
    title: 'Read the projects',
    description:
      'RAG systems, applied reinforcement learning, and NLP, with the code and write-ups behind them.',
  },
];

export function QuickstartCards() {
  return (
    <div className="not-prose @container my-6">
      <div className="grid gap-3 @xl:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col gap-1.5 rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/60 hover:bg-fd-primary/5"
          >
            <span className="font-mono text-sm font-medium text-fd-foreground transition-colors group-hover:text-fd-primary">
              {card.title}
            </span>
            <span className="text-sm text-fd-muted-foreground">
              {card.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
