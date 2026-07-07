'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';

import WumpusBoard from './WumpusBoard';
import type { WumpusState } from '@/lib/wumpus/reducer';
import type { Direction } from '@/lib/wumpus/types';
import {
  canHitWumpus,
  getNextPosition,
  getSenses,
  gridStatusFor,
  GOLD_POS,
  GRID_SIZE,
  isSameTile,
  PIT_TILES,
  POPUP_PHASES,
  resolvePostDeathPhase,
  toTileKey,
  WUMPUS_POS,
  type Coord,
  type TutorialPhase,
} from '@/lib/wumpus/tutorial';

interface PopupContent {
  title: string;
  body: string;
  icon: string | null;
}

const POPUP_CONTENT: Record<string, PopupContent> = {
  welcome: {
    title: 'The Hunt Begins',
    body: 'Welcome to the dungeon, Hunter. Your goal is to find the gold hidden somewhere in these tunnels and escape alive. Standing between you and victory are bottomless pits, invisible cracks in the floor that will swallow you whole, and the Wumpus, a territorial predator that hunts by scent. You have one arrow. The dungeon does not forgive mistakes.',
    icon: null,
  },
  move: {
    title: 'Movement',
    body: 'Use WASD or the arrow keys to move one tile at a time in any direction. The dungeon is hidden, so tiles only reveal themselves when you step on them. Explore carefully. Your starting tile is safe. What lies beyond it is unknown.',
    icon: null,
  },
  breeze: {
    title: 'You Feel a Cold Draft',
    body: 'A chill in the air. This means a bottomless pit lies in one of the four tiles directly adjacent to you: up, down, left, or right. Pits are completely invisible. The breeze is your only warning. Never step into an unexplored tile that borders a breeze unless you have ruled it out from a different angle. Cross-reference breezes from multiple positions to locate the pit exactly.',
    icon: 'breeze',
  },
  stench: {
    title: 'Something Foul Lurks Nearby',
    body: "A rancid stench fills the corridor. A red glow on the tile edge warns you of the Wumpus's direction. The Wumpus moves every turn in the real game: each time you move, it moves too, closing the gap. To survive, you must kill it first. You have one arrow. Press Space to enter Aim Mode, then press a direction key to fire your arrow down that entire corridor. The arrow travels the full length, so if the Wumpus is anywhere in that line, it dies. Choose your shot carefully.",
    icon: 'stench',
  },
  wumpus_killed: {
    title: 'The Wumpus is Dead',
    body: 'Your arrow cut through the dark and found its mark. The Wumpus is slain. The dungeon is quieter now, but the pits remain, so watch for breezes. Your next goal is the gold. You will sense a faint golden glimmer when you are near it. Follow the glimmer and step onto the gold tile to escape.',
    icon: 'wumpus',
  },
  shine: {
    title: 'A Golden Glimmer',
    body: 'You sense the unmistakable shimmer of gold. It is in a tile adjacent to you, or right beneath your feet. This is what you came here for. Step onto the gold tile to claim it and escape the dungeon.',
    icon: 'shine',
  },
  complete: {
    title: 'You Survived',
    body: "You found the gold and made it out alive. You have learned to read the dungeon's warnings: the breezes that speak of pits, the stench that betrays the Wumpus, and the glimmer that marks your prize. In the real game, the Wumpus hunts you actively and there are no second chances. Trust your senses. Think before you step. Good luck, Hunter.",
    icon: 'gold',
  },
  death_pit: {
    title: 'You Fell Into a Pit',
    body: 'There was no bottom. In the real game, this ends your run permanently. A cold breeze always precedes a pit, so if you felt a draft, it was warning you. Before entering any unknown tile, check whether you have felt a breeze from adjacent explored tiles. Cross-reference multiple positions to narrow down where the pit actually is. You have been stepped back to your previous position.',
    icon: 'pit',
  },
  death_wumpus: {
    title: 'The Wumpus Got You',
    body: 'It was over in an instant. In the real game, the Wumpus moves toward you every turn, hunting by tracking your scent trail. A red glow on the tile edge warns you of its direction. When you sense something foul, do not advance blindly. Use Space to enter Aim Mode and fire your arrow in the direction of the stench before the Wumpus closes in. You have been stepped back to your previous position.',
    icon: 'wumpus',
  },
};

const PHASE_MESSAGES = {
  exploring: 'Explore safely. Use clues before committing to unknown tiles.',
  aim: 'Press Space to enter Aim Mode, then fire with a direction key.',
  find_gold: 'The Wumpus is down. Keep hunting for the gold.',
  shine: 'Gold is close. Step carefully and claim it.',
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  KeyW: 'NORTH',
  ArrowUp: 'NORTH',
  KeyS: 'SOUTH',
  ArrowDown: 'SOUTH',
  KeyD: 'EAST',
  ArrowRight: 'EAST',
  KeyA: 'WEST',
  ArrowLeft: 'WEST',
};

function spriteStyle(name: string): CSSProperties {
  return {
    backgroundImage: `url(/wumpus/${name}.svg)`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };
}

interface TutorialPopupProps {
  content: PopupContent;
  dismissLabel: string;
  onDismiss: () => void;
}

function TutorialPopup({
  content,
  dismissLabel,
  onDismiss,
}: TutorialPopupProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      className="absolute inset-0 z-10 flex items-center justify-center bg-fd-background/70 p-4 backdrop-blur-sm"
    >
      <div className="nb-box max-w-md p-5">
        {content.icon ? (
          <span
            aria-hidden
            className="mb-3 block h-10 w-10"
            style={spriteStyle(content.icon)}
          />
        ) : null}
        <h3 className="font-display text-lg font-semibold text-fd-foreground">
          {content.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
          {content.body}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-4 rounded-full bg-fd-primary px-5 py-2 font-mono text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}

interface WumpusTutorialProps {
  onExit: () => void;
}

export function WumpusTutorial({ onExit }: WumpusTutorialProps) {
  const [playerPos, setPlayerPos] = useState<Coord>([0, 0]);
  const [prevPos, setPrevPos] = useState<Coord>([0, 0]);
  const [exploredTiles, setExploredTiles] = useState<Coord[]>([[0, 0]]);
  const [phase, setPhase] = useState<TutorialPhase>('welcome');
  const [phaseBeforeDeath, setPhaseBeforeDeath] =
    useState<TutorialPhase>('exploring');
  const [isAiming, setIsAiming] = useState(false);
  const [isWumpusAlive, setIsWumpusAlive] = useState(true);
  const [turn, setTurn] = useState(0);
  const [message, setMessage] = useState('Dismiss the prompts to begin.');
  const [seenBreeze, setSeenBreeze] = useState(false);
  const [seenStench, setSeenStench] = useState(false);
  const [seenShine, setSeenShine] = useState(false);

  const isPopupPhase = POPUP_PHASES.has(phase);
  const senses = useMemo(
    () => getSenses(playerPos, isWumpusAlive),
    [playerPos, isWumpusAlive],
  );

  const addExplored = useCallback((next: Coord) => {
    setExploredTiles((prev) => {
      const k = toTileKey(next);
      return prev.some((t) => toTileKey(t) === k) ? prev : [...prev, next];
    });
  }, []);

  const handleShoot = useCallback(
    (direction: Direction) => {
      if (!isWumpusAlive) {
        setMessage('The Wumpus is already dead.');
        return;
      }
      setTurn((t) => t + 1);
      if (canHitWumpus(playerPos, direction)) {
        setIsWumpusAlive(false);
        setIsAiming(false);
        setPhase('wumpus_killed');
        return;
      }
      setMessage('Your arrow flies down the corridor and misses.');
    },
    [isWumpusAlive, playerPos],
  );

  const handleMove = useCallback(
    (direction: Direction) => {
      const next = getNextPosition(playerPos, direction);
      if (isSameTile(next, playerPos)) return;

      setPrevPos(playerPos);
      setPlayerPos(next);
      addExplored(next);
      setTurn((t) => t + 1);

      if (PIT_TILES.some((pit) => isSameTile(pit, next))) {
        setPhaseBeforeDeath(phase);
        setPhase('death_pit');
        return;
      }
      if (isWumpusAlive && isSameTile(next, WUMPUS_POS)) {
        setPhaseBeforeDeath(phase);
        setPhase('death_wumpus');
        return;
      }
      if (isSameTile(next, GOLD_POS)) {
        setPhase('complete');
        return;
      }

      const nextSenses = getSenses(next, isWumpusAlive);
      if (!seenBreeze && nextSenses.breeze) {
        setSeenBreeze(true);
        setPhase('breeze');
        return;
      }
      if (seenBreeze && !seenStench && nextSenses.stench_direction) {
        setSeenStench(true);
        setPhase('stench');
        return;
      }
      if (!seenShine && nextSenses.shine) {
        setSeenShine(true);
        setPhase('shine');
        return;
      }
      if (nextSenses.stench_direction && isWumpusAlive) {
        setMessage('You smell the Wumpus nearby.');
        return;
      }
      if (nextSenses.breeze) {
        setMessage('You feel a cold breeze.');
        return;
      }
      if (nextSenses.shine) {
        setMessage('A golden glimmer is nearby.');
        return;
      }
      setMessage(
        phase === 'aim' ? PHASE_MESSAGES.aim : PHASE_MESSAGES.exploring,
      );
    },
    [
      addExplored,
      isWumpusAlive,
      phase,
      playerPos,
      seenBreeze,
      seenShine,
      seenStench,
    ],
  );

  const toggleAim = useCallback(() => {
    setIsAiming((prev) => {
      const nextAiming = !prev;
      setMessage(
        nextAiming
          ? 'Aim mode on. Press a direction to fire.'
          : 'Aim mode off. Movement restored.',
      );
      return nextAiming;
    });
  }, []);

  const dismissPopup = useCallback(() => {
    switch (phase) {
      case 'welcome':
        setPhase('move');
        return;
      case 'move':
      case 'breeze':
        setPhase('exploring');
        setMessage(PHASE_MESSAGES.exploring);
        return;
      case 'stench':
        setPhase('aim');
        setMessage(PHASE_MESSAGES.aim);
        return;
      case 'wumpus_killed':
        setPhase('find_gold');
        setMessage(PHASE_MESSAGES.find_gold);
        return;
      case 'shine':
        setPhase('find_gold');
        setMessage(PHASE_MESSAGES.shine);
        return;
      case 'complete':
        onExit();
        return;
      case 'death_pit':
      case 'death_wumpus':
        setPlayerPos(prevPos);
        setIsAiming(false);
        setPhase(resolvePostDeathPhase(phaseBeforeDeath));
        setMessage('You were stepped back one tile. Continue carefully.');
        return;
      default:
        return;
    }
  }, [onExit, phase, phaseBeforeDeath, prevPos]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isPopupPhase) return;
      if (event.code === 'Space') {
        event.preventDefault();
        toggleAim();
        return;
      }
      const direction = KEY_TO_DIRECTION[event.code];
      if (!direction) return;
      event.preventDefault();
      if (isAiming) handleShoot(direction);
      else handleMove(direction);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAiming, isPopupPhase, handleMove, handleShoot, toggleAim]);

  const boardState: WumpusState = {
    gameId: 'tutorial',
    status: gridStatusFor(phase),
    gridSize: GRID_SIZE,
    turn,
    playerPos,
    arrowsRemaining: isWumpusAlive ? 1 : 0,
    exploredTiles,
    senses,
    message,
    isLoading: false,
    isAiming,
    error: null,
    difficulty: 'tutorial',
    wumpusesRemaining: isWumpusAlive ? 1 : 0,
  };

  const popup = POPUP_CONTENT[phase] ?? null;
  const dismissLabel =
    phase === 'complete'
      ? 'Start the real game →'
      : phase === 'death_pit' || phase === 'death_wumpus'
        ? 'Try again →'
        : 'Got it →';

  const padButton = (direction: Direction, glyph: string) => (
    <button
      type="button"
      onClick={() =>
        isAiming ? handleShoot(direction) : handleMove(direction)
      }
      disabled={isPopupPhase}
      aria-label={`${isAiming ? 'Shoot' : 'Move'} ${direction.toLowerCase()}`}
      className={`flex aspect-square items-center justify-center rounded-md border text-lg transition-colors disabled:opacity-40 ${
        isAiming
          ? 'border-red-500/50 text-red-500 hover:bg-red-500/10'
          : 'border-fd-border text-fd-foreground hover:border-fd-primary/50 hover:bg-fd-primary/10'
      }`}
    >
      {glyph}
    </button>
  );

  return (
    <div className="not-prose relative my-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="w-full lg:w-[min(72vh,600px)] lg:shrink-0">
          <WumpusBoard state={boardState} />
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-72">
          <div className="rounded-lg border border-fd-border p-3">
            <div className="flex items-center justify-between font-mono text-xs text-fd-muted-foreground">
              <span>Turn {turn}</span>
              <span className="text-fd-primary">tutorial</span>
            </div>
            <p className="mt-2 min-h-[2.75rem] text-sm text-fd-foreground">
              {message}
            </p>
          </div>

          <div>
            <div className="mx-auto grid w-40 grid-cols-3 gap-1.5">
              <span />
              {padButton('NORTH', '↑')}
              <span />
              {padButton('WEST', '←')}
              <button
                type="button"
                onClick={toggleAim}
                disabled={isPopupPhase}
                aria-pressed={isAiming}
                aria-label="Toggle aim"
                className={`flex aspect-square items-center justify-center rounded-md border font-mono text-xs transition-colors disabled:opacity-40 ${
                  isAiming
                    ? 'border-red-500 bg-red-500/15 text-red-500'
                    : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50'
                }`}
              >
                {isAiming ? 'aim' : '◎'}
              </button>
              {padButton('EAST', '→')}
              <span />
              {padButton('SOUTH', '↓')}
              <span />
            </div>
            <p className="mt-2 text-center font-mono text-xs text-fd-muted-foreground">
              {isAiming
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

          <button
            type="button"
            onClick={onExit}
            className="self-start rounded-full border border-fd-border px-4 py-1.5 font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
          >
            Skip tutorial
          </button>
        </aside>
      </div>

      {popup ? (
        <TutorialPopup
          content={popup}
          dismissLabel={dismissLabel}
          onDismiss={dismissPopup}
        />
      ) : null}
    </div>
  );
}
