'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { alreadyInvited, markInvited } from '@/lib/invite';

const TARGET = (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="8" cy="8" r="6" />
    <circle cx="8" cy="8" r="2.5" />
  </svg>
);

const CHAT = (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinejoin="round"
  >
    <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
  </svg>
);

const TAG = (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinejoin="round"
  >
    <path d="M4 2.5h8v11l-4-2.5-4 2.5z" />
  </svg>
);

interface Nudge {
  match: (path: string) => boolean;
  icon: ReactNode;
  message: string;
  cta: string;
  href: string;
}

const NUDGES: Nudge[] = [
  {
    match: (p) => p === '/projects/hunter-wumpus',
    icon: TARGET,
    message: 'You can stop reading and just play it.',
    cta: 'Play Hunter Wumpus',
    href: '/projects/hunter-wumpus/play',
  },
  {
    match: (p) => p === '/twin',
    icon: CHAT,
    message: 'Quicker to ask than to read? The twin knows this corpus.',
    cta: 'Ask the twin',
    href: '/twin/chat',
  },
  {
    match: (p) => p === '/architecture',
    icon: CHAT,
    message: 'This is the live system, not a diagram of a dream.',
    cta: 'Ask the twin',
    href: '/twin/chat',
  },
  {
    match: (p) => p === '/research',
    icon: TARGET,
    message: 'The agent from this paper is playable in the browser.',
    cta: 'Play the game',
    href: '/projects/hunter-wumpus/play',
  },
  {
    match: (p) => p === '/changelog',
    icon: TAG,
    message: 'This site keeps release notes of its own.',
    cta: 'See what shipped',
    href: '/release-notes',
  },
];

const DWELL_MS = 50000;

export function ContextualNudge() {
  const pathname = usePathname();
  const [shown, setShown] = useState<{ nudge: Nudge; path: string } | null>(
    null,
  );

  useEffect(() => {
    if (alreadyInvited()) return;
    const match = NUDGES.find((nudge) => nudge.match(pathname));
    if (!match) return;
    const timer = setTimeout(() => {
      if (alreadyInvited()) return;
      markInvited();
      setShown({ nudge: match, path: pathname });
    }, DWELL_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Rendering by matching path (rather than clearing state in an effect) lets a
  // navigation auto-dismiss the nudge without a cascading setState.
  if (!shown || shown.path !== pathname) return null;

  return (
    <div className="nudge-in fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 rounded-lg border border-fd-border bg-fd-background/95 px-3.5 py-2.5 shadow-md backdrop-blur">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0 text-fd-primary">
          {shown.nudge.icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-fd-foreground">{shown.nudge.message}</p>
          <Link
            href={shown.nudge.href}
            onClick={() => setShown(null)}
            className="mt-1.5 inline-block font-mono text-xs text-fd-primary transition-opacity hover:opacity-80"
          >
            {shown.nudge.cta} →
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setShown(null)}
          aria-label="Dismiss"
          className="-mr-0.5 -mt-0.5 shrink-0 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
