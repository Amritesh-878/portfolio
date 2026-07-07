'use client';

import { useEffect, useState } from 'react';

import {
  allEggsFound,
  claimFinal,
  EGGS_EVENT,
  finalClaimed,
  TRIGGER_FINAL,
} from '@/lib/eggs';

const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

type Phase = 'hidden' | 'achievement' | 'oneLast' | 'final';

export function FinalEgg() {
  const [phase, setPhase] = useState<Phase>('hidden');

  useEffect(() => {
    const check = () => {
      if (allEggsFound() && !finalClaimed()) setPhase('achievement');
    };
    check();
    window.addEventListener(EGGS_EVENT, check);
    return () => window.removeEventListener(EGGS_EVENT, check);
  }, []);

  // Dev-palette shortcut: force the payoff regardless of progress, so it can be
  // demoed without hunting every egg first.
  useEffect(() => {
    const force = () => setPhase('achievement');
    window.addEventListener(TRIGGER_FINAL, force);
    return () => window.removeEventListener(TRIGGER_FINAL, force);
  }, []);

  // The video opens via the anchor below on the visitor's own click, not
  // automatically — choosing their own fate is the joke. A real link click opens
  // the tab reliably; window.open with a features string reads as a popup and gets
  // blocked. reveal only drives the page's own transition to the punchline.
  const reveal = () => {
    claimFinal();
    setPhase('oneLast');
    setTimeout(() => setPhase('final'), 1600);
  };

  if (phase === 'hidden') return null;

  const black = phase === 'oneLast' || phase === 'final';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center font-mono transition-colors duration-1000"
      style={{ background: black ? '#000' : 'rgba(9, 8, 6, 0.96)' }}
    >
      {phase === 'achievement' ? (
        <div className="max-w-md">
          <p className="text-sm uppercase tracking-widest text-fd-primary">
            Achievement unlocked
          </p>
          <p className="mt-4 text-xl text-fd-foreground">
            You found every easter egg.
          </p>
          <p className="mt-3 text-sm text-fd-muted-foreground">
            I honestly didn&apos;t think anyone would.
          </p>
          <p className="mt-1 text-sm text-fd-muted-foreground">...</p>
          <a
            href={RICKROLL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={reveal}
            className="mt-8 inline-block rounded-full border border-fd-primary/60 px-6 py-2.5 text-sm text-fd-primary transition-colors hover:bg-fd-primary/10"
          >
            Reveal the final secret
          </a>
        </div>
      ) : phase === 'oneLast' ? (
        <p className="text-sm tracking-widest text-neutral-500">
          One last thing.
        </p>
      ) : (
        <div className="max-w-md text-neutral-200">
          <p className="text-xl">Congratulations.</p>
          <p className="mt-3 text-neutral-400">
            You were technically never given up.
          </p>
          <button
            type="button"
            onClick={() => setPhase('hidden')}
            className="mt-10 text-xs text-neutral-600 transition-colors hover:text-neutral-400"
          >
            close
          </button>
        </div>
      )}
    </div>
  );
}
