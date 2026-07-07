import Link from 'next/link';
import type { ReactNode } from 'react';

interface Row {
  label: string;
  value: ReactNode;
}

const ROWS: Row[] = [
  {
    label: 'Current',
    value: (
      <>
        AI &amp; ML Associate,{' '}
        <span className="text-fd-foreground">Impact Solutions Lab</span>
      </>
    ),
  },
  { label: 'Education', value: 'B.Tech, Artificial Intelligence & ML' },
  {
    label: 'Research',
    value: (
      <Link href="/research" className="text-fd-primary hover:underline">
        1 publication, 1 patent application
      </Link>
    ),
  },
  {
    label: 'Projects',
    value: (
      <Link href="/projects" className="text-fd-primary hover:underline">
        Hunter Wumpus, AI Twin, and more
      </Link>
    ),
  },
  {
    label: 'Changelog',
    value: (
      <Link href="/changelog" className="text-fd-primary hover:underline">
        What shipped, when
      </Link>
    ),
  },
];

export function SpecSheet() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="font-display text-sm font-semibold tracking-wide text-fd-muted-foreground uppercase">
        At a glance
      </h2>
      <dl className="nb-box mt-4 divide-y divide-fd-border">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <dt className="w-32 shrink-0 font-mono text-xs tracking-wide text-fd-muted-foreground uppercase">
              {row.label}
            </dt>
            <dd className="text-sm text-fd-muted-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
