// Tracks which easter eggs a visitor has found. When every trackable one is
// discovered, FinalEgg fires the completionist payoff. The source-view comment is
// deliberately excluded here since a page can't observe someone reading its source.
export const EGG_KEYS = [
  'devmode',
  'popup',
  'injection',
  'palette',
  'konami',
  'pit',
] as const;

export type EggKey = (typeof EGG_KEYS)[number];

const FOUND_KEY = 'portfolio-eggs-found';
const CLAIMED_KEY = 'portfolio-eggs-claimed';
export const EGGS_EVENT = 'portfolio-eggs-change';

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
  } catch {
    // localStorage can be blocked; egg tracking is best-effort.
  }
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
  } catch {
    // best-effort
  }
}
