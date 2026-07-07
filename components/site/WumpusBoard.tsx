import { memo, type CSSProperties, type ReactNode } from 'react';

import type { WumpusState } from '@/lib/wumpus/reducer';

type Reveal = 'pit' | 'gold' | 'wumpus' | null;

const SPRITE: CSSProperties = {
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
};

function sprite(name: string): CSSProperties {
  return { ...SPRITE, backgroundImage: `url(/wumpus/${name}.svg)` };
}

const STENCH_EDGE: Record<string, string> = {
  north: 'inset-x-0 top-0 h-[3px]',
  south: 'inset-x-0 bottom-0 h-[3px]',
  east: 'inset-y-0 right-0 w-[3px]',
  west: 'inset-y-0 left-0 w-[3px]',
};

interface TileProps {
  isExplored: boolean;
  isPlayer: boolean;
  breeze: boolean;
  shine: boolean;
  stench: string | null;
  reveal: Reveal;
}

function Tile({
  isExplored,
  isPlayer,
  breeze,
  shine,
  stench,
  reveal,
}: TileProps) {
  let surface = isExplored
    ? 'bg-fd-card'
    : 'bg-fd-foreground/[0.04] dark:bg-fd-foreground/[0.02]';
  if (isPlayer) surface = 'bg-fd-primary/10 ring-2 ring-inset ring-fd-primary';
  if (reveal === 'pit') surface = 'bg-neutral-900';
  if (reveal === 'gold') surface = 'bg-fd-primary/25';
  if (reveal === 'wumpus') surface = 'bg-red-500/25';

  const stenchEdges =
    stench === null
      ? []
      : stench.toLowerCase() === 'all'
        ? ['north', 'south', 'east', 'west']
        : [stench.toLowerCase()];

  return (
    <div className={`relative flex items-center justify-center ${surface}`}>
      {isPlayer ? (
        <span
          aria-hidden
          className="absolute h-[64%] w-[64%]"
          style={sprite('player')}
        />
      ) : null}
      {reveal ? (
        <span
          aria-hidden
          className="absolute h-[62%] w-[62%]"
          style={sprite(reveal)}
        />
      ) : null}
      {breeze ? (
        <span
          aria-hidden
          className="absolute bottom-[6%] left-[6%] h-[28%] w-[28%]"
          style={sprite('breeze')}
        />
      ) : null}
      {shine ? (
        <span
          aria-hidden
          className="absolute right-[6%] top-[6%] h-[28%] w-[28%]"
          style={sprite('shine')}
        />
      ) : null}
      {stenchEdges.map((edge) => (
        <span
          key={edge}
          aria-hidden
          className={`absolute bg-red-500/80 ${STENCH_EDGE[edge]}`}
        />
      ))}
    </div>
  );
}

interface WumpusBoardProps {
  state: WumpusState;
}

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function terminalReveal(
  status: WumpusState['status'],
  isPlayer: boolean,
): Reveal {
  if (!isPlayer) return null;
  if (status === 'PlayerLost_Pit') return 'pit';
  if (status === 'PlayerWon') return 'gold';
  if (status === 'PlayerLost_Wumpus') return 'wumpus';
  return null;
}

function WumpusBoard({ state }: WumpusBoardProps) {
  const { gridSize, playerPos, exploredTiles, senses, status } = state;
  const [px, py] = playerPos;
  const explored = new Set(exploredTiles.map(([x, y]) => key(x, y)));
  const isTerminal = status !== 'idle' && status !== 'Ongoing';

  const tiles: ReactNode[] = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const isPlayer = x === px && y === py;
      tiles.push(
        <Tile
          key={key(x, y)}
          isExplored={isPlayer || explored.has(key(x, y))}
          isPlayer={isPlayer}
          breeze={isPlayer && senses.breeze}
          shine={isPlayer && senses.shine}
          stench={isPlayer ? senses.stench_direction : null}
          reveal={isTerminal ? terminalReveal(status, isPlayer) : null}
        />,
      );
    }
  }

  return (
    <div
      aria-label="Game grid"
      className="grid aspect-square w-full gap-[2px] rounded-lg bg-fd-border/60 p-[2px]"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {tiles}
    </div>
  );
}

export default memo(WumpusBoard);
