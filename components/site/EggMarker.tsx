'use client';

import { useEffect } from 'react';

import { markEgg, type EggKey } from '@/lib/eggs';

export function EggMarker({ egg }: { egg: EggKey }) {
  useEffect(() => {
    markEgg(egg);
  }, [egg]);
  return null;
}
