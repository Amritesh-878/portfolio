import Link from 'next/link';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';

import { RELEASES, type Release } from '@/lib/release-notes';

const SECTIONS: {
  key: keyof Pick<Release, 'added' | 'changed' | 'fixed'>;
  label: string;
  color: string;
}[] = [
  {
    key: 'added',
    label: 'Added',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'changed',
    label: 'Changed',
    color: 'text-amber-600 dark:text-amber-400',
  },
  { key: 'fixed', label: 'Fixed', color: 'text-sky-600 dark:text-sky-400' },
];

export const metadata = {
  title: 'Release Notes',
  description:
    'The version history of this site, versioned like the software it is.',
};

export default function ReleaseNotesPage() {
  const ordered = [...RELEASES].sort(
    (a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false),
  );
  return (
    <DocsPage toc={[]}>
      <DocsTitle>Release Notes</DocsTitle>
      <DocsDescription>
        This site, versioned like the software it is.
      </DocsDescription>
      <DocsBody>
        <div className="not-prose">
          <p className="text-sm text-fd-muted-foreground">
            My career changelog lives{' '}
            <Link
              href="/changelog"
              className="text-fd-primary hover:opacity-80"
            >
              over here
            </Link>
            .
          </p>

          <div className="mt-8 space-y-10">
            {ordered.map((release) => (
              <section key={release.version}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-mono text-lg font-medium text-fd-primary">
                    v{release.version}
                  </h2>
                  <span className="text-sm text-fd-foreground">
                    {release.title}
                  </span>
                  {release.pinned ? (
                    <span className="rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2 py-0.5 font-mono text-[0.65rem] tracking-wide text-fd-primary uppercase">
                      Pinned
                    </span>
                  ) : null}
                  <span className="ml-auto font-mono text-xs text-fd-muted-foreground">
                    {release.date}
                  </span>
                </div>
                <div className="mt-3 space-y-3 border-l border-fd-border pl-4">
                  {SECTIONS.map(({ key, label, color }) => {
                    const items = release[key];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={key}>
                        <p
                          className={`font-mono text-xs uppercase tracking-wide ${color}`}
                        >
                          {label}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {items.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-fd-muted-foreground"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
