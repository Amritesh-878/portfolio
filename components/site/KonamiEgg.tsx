'use client';

import { useEffect, useState } from 'react';

import { markEgg, TRIGGER_KONAMI } from '@/lib/eggs';

// A shorter, forgiving take on the konami code: up up down down left right.
const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

export function KonamiEgg() {
  const [loose, setLoose] = useState(false);

  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === SEQUENCE[progress]) {
        progress += 1;
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
      if (progress === SEQUENCE.length) {
        progress = 0;
        setLoose(true);
        markEgg('konami');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onTrigger = () => {
      setLoose(true);
      markEgg('konami');
    };
    window.addEventListener(TRIGGER_KONAMI, onTrigger);
    return () => window.removeEventListener(TRIGGER_KONAMI, onTrigger);
  }, []);

  useEffect(() => {
    if (!loose) return;
    const timer = setTimeout(() => setLoose(false), 4800);
    return () => clearTimeout(timer);
  }, [loose]);

  if (!loose) return null;

  return (
    <div
      aria-hidden
      className="wumpus-run pointer-events-none fixed bottom-10 left-0 z-[70] h-24 w-24"
      style={{
        backgroundImage: 'url(/wumpus/wumpus.svg)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
}
