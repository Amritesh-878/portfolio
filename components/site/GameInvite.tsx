'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { alreadyInvited, markInvited } from '@/lib/invite';
import { prewarmGame } from '@/lib/game/prewarm';
import { markEgg, TRIGGER_WARGAMES } from '@/lib/eggs';

const ANSWERED_KEY = 'portfolio-game-invite';
const PAGES_KEY = 'portfolio-pages';
// Generous on purpose: a recruiter skimming a page or two in under a minute never
// sees this. Only a visitor who explores (a third page, or a minute and a half on
// one) gets the invite.
const DWELL_MS = 90000;
const PAGES_TO_TRIGGER = 3;
const EXCLUDED = ['/projects/hunter-wumpus/play', '/twin/chat'];

const HEADLINE = 'SHALL WE PLAY A GAME?';
const SUBLINE =
  "A PPO-trained Wumpus is waiting. It's already awake. I warned it you were coming.";

function answered(): boolean {
  try {
    return Boolean(window.localStorage.getItem(ANSWERED_KEY));
  } catch {
    return false;
  }
}

function setAnswered(value: 'played' | 'declined'): void {
  try {
    window.localStorage.setItem(ANSWERED_KEY, value);
  } catch {
    // best-effort; a blocked localStorage just means the popup can recur
  }
}

export function GameInvite() {
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const open = useCallback((force = false) => {
    if (!force && (alreadyInvited() || answered())) return;
    markInvited();
    markEgg('popup');
    prewarmGame();
    setShow(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(HEADLINE);
      return;
    }
    let i = 0;
    typeTimer.current = setInterval(() => {
      i += 1;
      setTyped(HEADLINE.slice(0, i));
      if (i >= HEADLINE.length && typeTimer.current) {
        clearInterval(typeTimer.current);
      }
    }, 35);
  }, []);

  // Engagement trigger: fire on the second page of a visit, or after a dwell on
  // any one page. Never on the first paint, never after an answer.
  useEffect(() => {
    if (answered() || alreadyInvited() || EXCLUDED.includes(pathname)) return;
    let pages = 1;
    try {
      pages = Number(window.sessionStorage.getItem(PAGES_KEY) ?? '0') + 1;
      window.sessionStorage.setItem(PAGES_KEY, String(pages));
    } catch {
      pages = 1;
    }
    // The trigger page shows after a short beat; earlier pages wait out the dwell.
    // Both go through a timer so the state change never lands synchronously here.
    const timer = setTimeout(
      () => open(),
      pages >= PAGES_TO_TRIGGER ? 800 : DWELL_MS,
    );
    return () => clearTimeout(timer);
  }, [pathname, open]);

  // A dev-mode palette command can force the invite open, ignoring the usual guards.
  useEffect(() => {
    const onTrigger = () => open(true);
    window.addEventListener(TRIGGER_WARGAMES, onTrigger);
    return () => window.removeEventListener(TRIGGER_WARGAMES, onTrigger);
  }, [open]);

  // Pre-warm the sleeping Space the instant a visitor hovers or focuses a play link.
  useEffect(() => {
    const onHover = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a[href*="hunter-wumpus/play"]')) prewarmGame();
    };
    document.addEventListener('mouseover', onHover, { passive: true });
    document.addEventListener('focusin', onHover);
    return () => {
      document.removeEventListener('mouseover', onHover);
      document.removeEventListener('focusin', onHover);
      if (typeTimer.current) clearInterval(typeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (show) yesRef.current?.focus();
  }, [show]);

  const dismiss = useCallback((value: 'played' | 'declined') => {
    setAnswered(value);
    setShow(false);
  }, []);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dismiss('declined');
      return;
    }
    if (event.key !== 'Tab') return;
    const buttons = dialogRef.current?.querySelectorAll('button');
    if (!buttons || buttons.length === 0) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-fd-background/70 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Play Hunter Wumpus"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-md rounded-lg border border-fd-primary/40 bg-fd-background p-6 font-mono shadow-2xl"
      >
        <p className="text-lg font-medium text-fd-primary">
          {typed}
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-fd-primary align-middle" />
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
          {SUBLINE}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            ref={yesRef}
            type="button"
            onClick={() => {
              dismiss('played');
              router.push('/projects/hunter-wumpus/play');
            }}
            className="rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            yes, enter the dungeon
          </button>
          <button
            type="button"
            onClick={() => dismiss('declined')}
            className="rounded-md border border-fd-border px-4 py-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            not now
          </button>
        </div>
      </div>
    </div>
  );
}
