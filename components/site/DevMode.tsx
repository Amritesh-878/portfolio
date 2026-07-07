'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { isDevMode, setDevMode, useDevMode } from '@/lib/dev-mode';
import { markEgg } from '@/lib/eggs';

const UNLOCK_CLICKS = 10;
const CLICK_WINDOW_MS = 2000;

function unlockedToast() {
  toast.custom(
    () => (
      <div className="nb-box flex items-start gap-3 rounded-md bg-fd-background px-4 py-3 font-mono">
        <span className="mt-px select-none text-fd-primary" aria-hidden>
          {'>_'}
        </span>
        <div>
          <p className="text-sm font-semibold text-fd-foreground">
            You found developer mode
          </p>
          <p className="mt-0.5 text-xs text-fd-muted-foreground">
            The internals badge is now in the corner.
          </p>
        </div>
      </div>
    ),
    { duration: 5000 },
  );
}

export function DevMode() {
  const active = useDevMode();
  const count = useRef(0);
  const lastClick = useRef(0);
  const retreatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest('[data-dev-trigger]');
      if (!(trigger instanceof HTMLElement)) return;
      const now = event.timeStamp;
      count.current =
        now - lastClick.current < CLICK_WINDOW_MS ? count.current + 1 : 1;
      lastClick.current = now;

      if (count.current >= UNLOCK_CLICKS && !isDevMode()) {
        count.current = 0;
        trigger.style.setProperty('--dev-progress', '0');
        setDevMode(true);
        markEgg('devmode');
        unlockedToast();
        return;
      }

      // The name glows and the Wumpus peeks further with each click, then retreats
      // if the streak stalls so a single stray click leaves no trace.
      trigger.style.setProperty(
        '--dev-progress',
        String(Math.min(count.current, UNLOCK_CLICKS) / UNLOCK_CLICKS),
      );
      if (retreatTimer.current) clearTimeout(retreatTimer.current);
      retreatTimer.current = setTimeout(() => {
        count.current = 0;
        trigger.style.setProperty('--dev-progress', '0');
      }, 2500);
    };

    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('click', onDocClick);
      if (retreatTimer.current) clearTimeout(retreatTimer.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/95 px-3 py-1.5 font-mono text-xs shadow-sm backdrop-blur">
      <span className="inline-block h-2 w-2 rounded-full bg-fd-primary" />
      <span className="text-fd-muted-foreground">dev mode</span>
      <Link
        href="/internals"
        className="text-fd-primary transition-opacity hover:opacity-80"
      >
        internals
      </Link>
      <button
        type="button"
        onClick={() => setDevMode(false)}
        aria-label="Turn off developer mode"
        className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        ✕
      </button>
    </div>
  );
}
