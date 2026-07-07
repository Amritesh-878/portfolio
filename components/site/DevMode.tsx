'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { isDevMode, setDevMode, useDevMode } from '@/lib/dev-mode';
import { markEgg } from '@/lib/eggs';

const UNLOCK_CLICKS = 10;
const CLICK_WINDOW_MS = 2000;

export function DevMode() {
  const active = useDevMode();
  const [toast, setToast] = useState(false);
  const count = useRef(0);
  const lastClick = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        setToast(true);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(false), 4500);
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
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (retreatTimer.current) clearTimeout(retreatTimer.current);
    };
  }, []);

  return (
    <>
      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-fd-primary/50 bg-fd-background/95 px-5 py-2.5 font-mono text-sm text-fd-primary shadow-lg backdrop-blur"
        >
          Congrats, you found developer mode!
        </div>
      ) : null}

      {active ? (
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
      ) : null}
    </>
  );
}
