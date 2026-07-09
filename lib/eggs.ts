// The source-view comment and the 404 pit are untrackable, so they never gate completion.
export const EGG_KEYS = [
  'devmode',
  'popup',
  'injection',
  'palette',
  'konami',
] as const;

export type EggKey = (typeof EGG_KEYS)[number];

const FOUND_KEY = 'portfolio-eggs-found';
const CLAIMED_KEY = 'portfolio-eggs-claimed';
export const EGGS_EVENT = 'portfolio-eggs-change';

// Dev-mode palette commands dispatch these so the timed eggs can be fired on demand
export const TRIGGER_WARGAMES = 'portfolio-trigger-wargames';
export const TRIGGER_KONAMI = 'portfolio-trigger-konami';
export const TRIGGER_NUDGE = 'portfolio-trigger-nudge';
export const TRIGGER_FINAL = 'portfolio-trigger-final';

export function foundEggs(): EggKey[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FOUND_KEY) ?? '';
    const keys: readonly string[] = EGG_KEYS;
    return raw.split(',').filter((key): key is EggKey => keys.includes(key));
  } catch {
    return [];
  }
}

export function markEgg(key: EggKey): void {
  if (typeof window === 'undefined') return;
  try {
    const found = new Set(foundEggs());
    if (found.has(key)) return;
    found.add(key);
    window.localStorage.setItem(FOUND_KEY, [...found].join(','));
    window.dispatchEvent(new CustomEvent(EGGS_EVENT));
  } catch {}
}

export function allEggsFound(): boolean {
  return foundEggs().length >= EGG_KEYS.length;
}

export function finalClaimed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLAIMED_KEY) === '1';
  } catch {
    return false;
  }
}

export function claimFinal(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CLAIMED_KEY, '1');
  } catch {}
}
