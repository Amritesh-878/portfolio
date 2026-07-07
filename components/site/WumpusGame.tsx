'use client';

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import WumpusBoard from './WumpusBoard';
import { movePlayer, startGame, warmBackend } from '@/lib/wumpus/api';
import {
  initialState,
  wumpusReducer,
  type WumpusState,
} from '@/lib/wumpus/reducer';
import type { ActionType, Difficulty, Direction } from '@/lib/wumpus/types';

interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { value: 'easy', label: 'Easy', description: 'Wumpus moves every 2 turns' },
  { value: 'medium', label: 'Medium', description: 'Standard 1:1 pacing' },
  { value: 'hard', label: 'Hard', description: 'Smarter Wumpus policy' },
  {
    value: 'impossible_i',
    label: 'Impossible I',
    description: '1–2 Wumpuses, more pits',
  },
  {
    value: 'impossible_ii',
    label: 'Impossible II',
    description: '2–3 Wumpuses, many pits',
  },
  {
    value: 'impossible_iii',
    label: 'Impossible III',
    description: '3–4 Wumpuses, maximum chaos',
  },
];

const GRID_SIZES: { label: string; value: number }[] = [
  { label: 'Small', value: 6 },
  { label: 'Medium', value: 8 },
  { label: 'Large', value: 10 },
];

const CODE_TO_DIRECTION: Record<string, Direction> = {
  KeyW: 'NORTH',
  ArrowUp: 'NORTH',
  KeyS: 'SOUTH',
  ArrowDown: 'SOUTH',
  KeyD: 'EAST',
  ArrowRight: 'EAST',
  KeyA: 'WEST',
  ArrowLeft: 'WEST',
};

const TERMINAL: Record<string, { title: string; body: string }> = {
  PlayerWon: {
    title: 'You found the gold',
    body: 'You escaped the cave with the treasure.',
  },
  WumpusKilled: {
    title: 'The Wumpus is slain',
    body: 'Your arrow found its mark in the dark.',
  },
  PlayerLost_Pit: {
    title: 'You fell',
    body: 'The ground gave way. There was no bottom.',
  },
  PlayerLost_Wumpus: {
    title: 'Devoured',
    body: 'The Wumpus found you in the dark.',
  },
};

function isTerminal(status: WumpusState['status']): boolean {
  return status !== 'idle' && status !== 'Ongoing';
}

export function WumpusGame() {
  const [state, dispatch] = useReducer(wumpusReducer, initialState);
  const [screen, setScreen] = useState<'select' | 'playing'>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gridSize, setGridSize] = useState(8);
  const [waking, setWaking] = useState(false);
  const inFlight = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    warmBackend();
  }, []);

  const start = useCallback(async () => {
    dispatch({ type: 'RESET_STATE' });
    dispatch({ type: 'SET_LOADING', payload: true });
    setScreen('playing');
    const slow = setTimeout(() => setWaking(true), 2500);
    try {
      const next = await startGame(gridSize, difficulty);
      dispatch({ type: 'UPDATE_STATE', payload: next });
    } catch (caught) {
      dispatch({
        type: 'SET_ERROR',
        payload: caught instanceof Error ? caught.message : 'Unknown error.',
      });
    } finally {
      clearTimeout(slow);
      setWaking(false);
    }
  }, [gridSize, difficulty]);

  const move = useCallback(
    async (direction: Direction) => {
      if (
        !state.gameId ||
        state.status !== 'Ongoing' ||
        state.isLoading ||
        inFlight.current
      ) {
        return;
      }
      inFlight.current = true;
      const action: ActionType = state.isAiming
        ? `SHOOT_${direction}`
        : direction;
      try {
        const next = await movePlayer(state.gameId, action);
        dispatch({ type: 'UPDATE_STATE', payload: next });
        dispatch({ type: 'SET_AIMING', payload: false });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Connection lost. Try again.' });
      } finally {
        inFlight.current = false;
      }
    },
    [state.gameId, state.status, state.isLoading, state.isAiming],
  );

  const toggleAim = useCallback(() => {
    if (
      state.isLoading ||
      state.status !== 'Ongoing' ||
      state.arrowsRemaining <= 0
    ) {
      return;
    }
    dispatch({ type: 'SET_AIMING', payload: !state.isAiming });
  }, [state.isLoading, state.status, state.arrowsRemaining, state.isAiming]);

  useEffect(() => {
    if (screen === 'playing' && state.gameId) {
      boardRef.current?.focus({ preventScroll: true });
    }
  }, [screen, state.gameId]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (state.status !== 'Ongoing' || state.isLoading) return;
    if (event.code === 'Space') {
      event.preventDefault();
      toggleAim();
      return;
    }
    const direction = CODE_TO_DIRECTION[event.code];
    if (!direction) return;
    event.preventDefault();
    void move(direction);
  };

  if (screen === 'select') {
    return (
      <div className="not-prose my-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-fd-muted-foreground">
            Find the gold and escape. Pits and the Wumpus both end the hunt. You
            have one arrow to fire straight down a corridor.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                aria-pressed={difficulty === option.value}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  difficulty === option.value
                    ? 'border-fd-primary bg-fd-primary/10'
                    : 'border-fd-border hover:border-fd-primary/50'
                }`}
              >
                <span className="block font-mono text-sm font-medium text-fd-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-fd-muted-foreground">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-fd-muted-foreground">Board</span>
            <div className="flex gap-1">
              {GRID_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setGridSize(size.value)}
                  aria-pressed={gridSize === size.value}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    gridSize === size.value
                      ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                      : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void start()}
            className="mt-5 rounded-full bg-fd-primary px-6 py-2.5 font-mono text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Enter the cave
          </button>
          {state.error ? (
            <p className="mt-3 text-sm text-red-500">{state.error}</p>
          ) : null}
        </div>
      </div>
    );
  }

  const terminal = isTerminal(state.status) ? TERMINAL[state.status] : null;
  const showLoading = state.isLoading && !state.gameId;
  const showError = Boolean(state.error) && !state.gameId && !state.isLoading;
  const canAct = state.status === 'Ongoing' && !state.isLoading;
  const isImpossible = state.difficulty.startsWith('impossible');

  const directionButton = (direction: Direction, glyph: string) => (
    <button
      type="button"
      onClick={() => void move(direction)}
      disabled={!canAct}
      aria-label={`${state.isAiming ? 'Shoot' : 'Move'} ${direction.toLowerCase()}`}
      className={`flex aspect-square items-center justify-center rounded-md border text-lg transition-colors disabled:opacity-40 ${
        state.isAiming
          ? 'border-red-500/50 text-red-500 hover:bg-red-500/10'
          : 'border-fd-border text-fd-foreground hover:border-fd-primary/50 hover:bg-fd-primary/10'
      }`}
    >
      {glyph}
    </button>
  );

  return (
    <div className="not-prose my-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="relative w-full lg:w-[min(72vh,600px)] lg:shrink-0">
          <div
            ref={boardRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Hunter Wumpus board"
            className="rounded-lg outline-none ring-fd-primary/50 focus-visible:ring-2"
          >
            <WumpusBoard state={state} />
          </div>

          {showLoading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-fd-background/70 backdrop-blur-sm">
              <p className="font-mono text-sm text-fd-muted-foreground">
                {waking ? 'Waking the Wumpus…' : 'Setting the cave…'}
              </p>
            </div>
          ) : null}

          {showError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-fd-background/85 p-4 text-center backdrop-blur-sm">
              <p className="max-w-xs text-sm text-red-500">{state.error}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void start()}
                  className="rounded-full bg-fd-primary px-5 py-2 font-mono text-sm font-medium text-fd-primary-foreground hover:opacity-90"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('select')}
                  className="rounded-full border border-fd-border px-5 py-2 font-mono text-sm text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-primary"
                >
                  Back
                </button>
              </div>
            </div>
          ) : null}

          {terminal ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-fd-background/85 p-4 text-center backdrop-blur-sm">
              <h3 className="font-mono text-lg font-medium text-fd-foreground">
                {terminal.title}
              </h3>
              <p className="max-w-xs text-sm text-fd-muted-foreground">
                {terminal.body}
              </p>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => void start()}
                  className="rounded-full bg-fd-primary px-5 py-2 font-mono text-sm font-medium text-fd-primary-foreground hover:opacity-90"
                >
                  Play again
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('select')}
                  className="rounded-full border border-fd-border px-5 py-2 font-mono text-sm text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-primary"
                >
                  Change difficulty
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-72">
          <div className="rounded-lg border border-fd-border p-3">
            <div className="flex items-center justify-between font-mono text-xs text-fd-muted-foreground">
              <span>Turn {state.turn}</span>
              <span
                className={
                  state.arrowsRemaining > 0
                    ? 'text-fd-primary'
                    : 'text-fd-muted-foreground/60'
                }
              >
                {state.arrowsRemaining > 0 ? '1 arrow' : 'no arrows'}
              </span>
            </div>
            {isImpossible ? (
              <div className="mt-1 font-mono text-xs text-red-500">
                {state.wumpusesRemaining} wumpus
                {state.wumpusesRemaining > 1 ? 'es' : ''} remaining
              </div>
            ) : null}
            <p className="mt-2 min-h-[2.75rem] text-sm text-fd-foreground">
              {state.message || 'The hunt begins.'}
            </p>
          </div>

          <div>
            <div className="mx-auto grid w-40 grid-cols-3 gap-1.5">
              <span />
              {directionButton('NORTH', '↑')}
              <span />
              {directionButton('WEST', '←')}
              <button
                type="button"
                onClick={toggleAim}
                disabled={!canAct || state.arrowsRemaining <= 0}
                aria-pressed={state.isAiming}
                aria-label="Toggle aim"
                className={`flex aspect-square items-center justify-center rounded-md border font-mono text-xs transition-colors disabled:opacity-40 ${
                  state.isAiming
                    ? 'border-red-500 bg-red-500/15 text-red-500'
                    : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50'
                }`}
              >
                {state.isAiming ? 'aim' : '◎'}
              </button>
              {directionButton('EAST', '→')}
              <span />
              {directionButton('SOUTH', '↓')}
              <span />
            </div>
            <p className="mt-2 text-center font-mono text-xs text-fd-muted-foreground">
              {state.isAiming
                ? 'Aim mode: fire down a corridor'
                : 'Move with the pad, WASD, or arrows'}
            </p>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-fd-muted-foreground">
            <kbd className="rounded border border-fd-border px-1.5 py-0.5 font-mono">
              Space
            </kbd>
            <span className="self-center">Aim / cancel</span>
            <kbd className="rounded border border-fd-border px-1.5 py-0.5 font-mono">
              Aim + dir
            </kbd>
            <span className="self-center">Arrow flies the whole corridor</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void start()}
              disabled={state.isLoading}
              className="rounded-full border border-fd-border px-4 py-1.5 font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary disabled:opacity-40"
            >
              New game
            </button>
            <button
              type="button"
              onClick={() => setScreen('select')}
              className="rounded-full border border-fd-border px-4 py-1.5 font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
            >
              Difficulty
            </button>
          </div>

          {state.error && !terminal && !showError ? (
            <p className="text-sm text-red-500">{state.error}</p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
