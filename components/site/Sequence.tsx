'use client';

import type { ReactNode } from 'react';

export interface SeqParticipant {
  id: string;
  label: string;
}

export type SeqStep =
  | { msg: [string, string]; text: string; dashed?: boolean }
  | { note: [string, string]; text: string }
  | { frame: 'loop' | 'alt' | 'opt'; label: string; steps: SeqStep[] };

export interface SequenceProps {
  participants: SeqParticipant[];
  steps: SeqStep[];
  autonumber?: boolean;
}

const CHAR = 6.7;
const COL_MIN = 172;
const PAD = 14;
const ROW = 50;

function twidth(s: string): number {
  return Math.max(1, ...s.split('\n').map((l) => l.length)) * CHAR;
}

interface Arrow {
  fx: number;
  tx: number;
  y: number;
  text: string;
  dashed: boolean;
  self: boolean;
  num: number | null;
}
interface NoteBox {
  x: number;
  w: number;
  y: number;
  text: string;
}
interface FrameBox {
  kind: string;
  label: string;
  x: number;
  w: number;
  top: number;
  bottom: number;
}

const MUTED = 'var(--color-fd-muted-foreground)';
const FG = 'var(--color-fd-foreground)';
const CARD = 'var(--color-fd-card)';
const BORDER = 'var(--color-fd-border)';
const PRIMARY = 'var(--color-fd-primary)';
const SECONDARY = 'var(--color-fd-secondary)';

function badge(x: number, y: number, n: number): ReactNode {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill={PRIMARY} />
      <text
        x={x}
        y={y + 3.5}
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
        fill="var(--color-fd-background)"
      >
        {n}
      </text>
    </g>
  );
}

export function Sequence({ participants, steps, autonumber }: SequenceProps) {
  const idx = new Map(participants.map((p, i) => [p.id, i]));
  const n = participants.length;

  let colW = COL_MIN;
  participants.forEach((p) => {
    colW = Math.max(colW, twidth(p.label) + 30);
  });
  const sizePass = (ss: SeqStep[]): void => {
    for (const s of ss) {
      if ('msg' in s) {
        const f = idx.get(s.msg[0]) ?? 0;
        const t = idx.get(s.msg[1]) ?? 0;
        if (f !== t) {
          // Labels may overflow their arrow span a little; self-messages render
          // to the side and never need column width.
          colW = Math.max(colW, (twidth(s.text) * 0.72) / Math.abs(t - f));
        }
      } else if ('note' in s) {
        const a = idx.get(s.note[0]) ?? 0;
        const b = idx.get(s.note[1]) ?? 0;
        colW = Math.max(colW, (twidth(s.text) + 44) / (Math.abs(b - a) + 1));
      } else {
        sizePass(s.steps);
      }
    }
  };
  sizePass(steps);

  const cx = (i: number): number => PAD + colW / 2 + i * colW;
  const width = PAD * 2 + n * colW;
  const headLines = Math.max(
    ...participants.map((p) => p.label.split('\n').length),
  );
  const headH = headLines * 15 + 18;

  const arrows: Arrow[] = [];
  const notes: NoteBox[] = [];
  const frames: FrameBox[] = [];
  let y = headH + 38;
  let num = 1;

  const colsIn = (ss: SeqStep[], acc: number[]): number[] => {
    for (const s of ss) {
      if ('msg' in s) acc.push(idx.get(s.msg[0]) ?? 0, idx.get(s.msg[1]) ?? 0);
      else if ('note' in s)
        acc.push(idx.get(s.note[0]) ?? 0, idx.get(s.note[1]) ?? 0);
      else colsIn(s.steps, acc);
    }
    return acc;
  };

  const walk = (ss: SeqStep[]): void => {
    for (const s of ss) {
      if ('msg' in s) {
        const f = idx.get(s.msg[0]) ?? 0;
        const t = idx.get(s.msg[1]) ?? 0;
        const self = f === t;
        arrows.push({
          fx: cx(f),
          tx: cx(t),
          y,
          text: s.text,
          dashed: !!s.dashed,
          self,
          num: autonumber ? num++ : null,
        });
        y += self ? ROW + 18 : ROW;
      } else if ('note' in s) {
        const a = idx.get(s.note[0]) ?? 0;
        const b = idx.get(s.note[1]) ?? 0;
        const left = Math.min(a, b);
        const right = Math.max(a, b);
        notes.push({
          x: cx(left) - colW / 2 + 18,
          w: (right - left) * colW + colW - 36,
          y,
          text: s.text,
        });
        y += ROW;
      } else {
        const cols = colsIn(s.steps, []);
        const left = Math.min(...cols);
        const right = Math.max(...cols);
        const top = y - 26;
        y += 18;
        walk(s.steps);
        const bottom = y - ROW + 26;
        frames.push({
          kind: s.frame,
          label: s.label,
          x: cx(left) - colW / 2 + 8,
          w: (right - left) * colW + colW - 16,
          top,
          bottom,
        });
        y += 22;
      }
    }
  };
  walk(steps);

  const height = y + 6;

  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full"
        style={{ maxWidth: width, fontFamily: 'ui-monospace, monospace' }}
      >
        <defs>
          <marker
            id="seq-arrow"
            markerWidth={10}
            markerHeight={8}
            refX={7}
            refY={3}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill={MUTED} />
          </marker>
        </defs>

        {participants.map((p, i) => (
          <line
            key={`ll-${p.id}`}
            x1={cx(i)}
            y1={headH}
            x2={cx(i)}
            y2={height - 6}
            stroke={MUTED}
            strokeOpacity={0.4}
            strokeDasharray="3 5"
          />
        ))}

        {frames.map((fr, i) => (
          <g key={`fr-${i}`}>
            <rect
              x={fr.x}
              y={fr.top}
              width={fr.w}
              height={fr.bottom - fr.top}
              rx={6}
              fill="none"
              stroke={BORDER}
            />
            <path
              d={`M${fr.x},${fr.top} h 44 l -9,9 h -35 Z`}
              fill={SECONDARY}
              stroke={BORDER}
            />
            <text
              x={fr.x + 8}
              y={fr.top + 12}
              fontSize={10}
              fontWeight={600}
              fill={PRIMARY}
            >
              {fr.kind}
            </text>
            <text x={fr.x + 54} y={fr.top + 12} fontSize={10.5} fill={MUTED}>
              [{fr.label}]
            </text>
          </g>
        ))}

        {notes.map((nt, i) => (
          <g key={`nt-${i}`}>
            <rect
              x={nt.x}
              y={nt.y - 14}
              width={nt.w}
              height={26}
              rx={4}
              fill={SECONDARY}
              stroke={BORDER}
            />
            <text
              x={nt.x + nt.w / 2}
              y={nt.y + 3}
              fontSize={10.5}
              textAnchor="middle"
              fill={MUTED}
            >
              {nt.text}
            </text>
          </g>
        ))}

        {participants.map((p, i) => {
          const ls = p.label.split('\n');
          const bw = colW - 26;
          const mid = 4 + (headH - 10) / 2;
          return (
            <g key={`pb-${p.id}`}>
              <rect
                x={cx(i) - bw / 2}
                y={4}
                width={bw}
                height={headH - 10}
                rx={6}
                fill={CARD}
                stroke={PRIMARY}
                strokeOpacity={0.45}
              />
              {ls.map((l, j) => (
                <text
                  key={j}
                  x={cx(i)}
                  y={mid - (ls.length - 1) * 7 + j * 14 + 4}
                  fontSize={11.5}
                  textAnchor="middle"
                  fill={FG}
                >
                  {l}
                </text>
              ))}
            </g>
          );
        })}

        {arrows.map((a, i) => {
          if (a.self) {
            return (
              <g key={`ar-${i}`}>
                <path
                  d={`M${a.fx},${a.y} h 32 v 16 h -32`}
                  fill="none"
                  stroke={MUTED}
                  strokeWidth={1.4}
                  markerEnd="url(#seq-arrow)"
                  strokeDasharray={a.dashed ? '5 4' : undefined}
                />
                <text x={a.fx + 42} y={a.y + 4} fontSize={11} fill={FG}>
                  {a.text}
                </text>
                {a.num !== null && badge(a.fx, a.y, a.num)}
              </g>
            );
          }
          const dir = a.tx > a.fx ? 1 : -1;
          const mid = (a.fx + a.tx) / 2;
          return (
            <g key={`ar-${i}`}>
              <line
                x1={a.fx}
                y1={a.y}
                x2={a.tx - dir * 4}
                y2={a.y}
                stroke={MUTED}
                strokeWidth={1.4}
                markerEnd="url(#seq-arrow)"
                strokeDasharray={a.dashed ? '5 4' : undefined}
              />
              <text
                x={mid}
                y={a.y - 7}
                fontSize={11}
                textAnchor="middle"
                fill={FG}
              >
                {a.text}
              </text>
              {a.num !== null && badge(a.fx + dir * 4, a.y, a.num)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
