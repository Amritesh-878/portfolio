'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Nudge {
  match: (path: string) => boolean;
  message: string;
  cta: string;
  href: string;
}

const NUDGES: Nudge[] = [
  {
    match: (p) => p === '/projects/hunter-wumpus',
    message: 'Enjoying the write-up? The game itself is playable, right here.',
    cta: 'Play Hunter Wumpus',
    href: '/projects/hunter-wumpus/play',
  },
  {
    match: (p) => p === '/twin',
    message: 'You can ask my AI twin about any of this directly.',
    cta: 'Ask the twin',
    href: '/twin/chat',
  },
  {
    match: (p) => p === '/architecture',
    message: 'All of this is live, not a mockup. See the twin think.',
    cta: 'Ask the twin',
    href: '/twin/chat',
  },
  {
    match: (p) => p === '/research',
    message: 'The agent from this paper is playable in the browser.',
    cta: 'Play the game',
    href: '/projects/hunter-wumpus/play',
  },
  {
    match: (p) => p === '/changelog',
    message: 'This site keeps its own release notes, too.',
    cta: 'See what shipped',
    href: '/release-notes',
  },
];

const DWELL_MS = 10000;
const SESSION_KEY = 'portfolio-nudged';

export function ContextualNudge() {
  const pathname = usePathname();
  const [shown, setShown] = useState<{ nudge: Nudge; path: string } | null>(
    null,
  );

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const match = NUDGES.find((nudge) => nudge.match(pathname));
    if (!match) return;
    const timer = setTimeout(() => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
      setShown({ nudge: match, path: pathname });
    }, DWELL_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Rendering by matching path (rather than clearing state in an effect) lets a
  // navigation auto-dismiss the nudge without a cascading setState.
  if (!shown || shown.path !== pathname) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg border border-fd-border bg-fd-background/95 px-4 py-3 shadow-lg backdrop-blur">
      <div className="flex items-start gap-3">
        <p className="text-sm text-fd-foreground">{shown.nudge.message}</p>
        <button
          type="button"
          onClick={() => setShown(null)}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 shrink-0 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          ✕
        </button>
      </div>
      <Link
        href={shown.nudge.href}
        onClick={() => setShown(null)}
        className="mt-2 inline-block font-mono text-sm text-fd-primary transition-opacity hover:opacity-80"
      >
        {shown.nudge.cta} →
      </Link>
    </div>
  );
}
