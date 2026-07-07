'use client';

import { useEffect, useState, type ReactNode } from 'react';
import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

export interface ElkFlowNode {
  id: string;
  label: string;
  parent?: string;
}
export interface ElkFlowGroup {
  id: string;
  label: string;
}
export interface ElkFlowEdge {
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
  bi?: boolean;
}
export interface ElkFlowProps {
  nodes: ElkFlowNode[];
  groups?: ElkFlowGroup[];
  edges: ElkFlowEdge[];
  direction?: 'DOWN' | 'RIGHT';
}

const MUTED = 'var(--color-fd-muted-foreground)';
const FG = 'var(--color-fd-foreground)';
const CARD = 'var(--color-fd-card)';
const BORDER = 'var(--color-fd-border)';
const PRIMARY = 'var(--color-fd-primary)';
const SECONDARY = 'var(--color-fd-secondary)';

interface Pt {
  x: number;
  y: number;
}
interface DrawNode {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}
interface DrawGroup {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  lx: number;
  ly: number;
  lw: number;
  lh: number;
}
interface DrawEdge {
  pts: Pt[];
  dashed: boolean;
  bi: boolean;
}
interface DrawLabel {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
}
interface Laid {
  width: number;
  height: number;
  nodes: DrawNode[];
  groups: DrawGroup[];
  edges: DrawEdge[];
  edgeLabels: DrawLabel[];
}

function nodeSize(label: string): { width: number; height: number } {
  const lines = label.split('\n');
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return {
    width: Math.max(112, Math.round(longest * 7.4) + 30),
    height: lines.length * 18 + 22,
  };
}

async function layout(props: ElkFlowProps): Promise<Laid> {
  const dir = props.direction ?? 'DOWN';
  const groups = props.groups ?? [];
  const groupIds = new Set(groups.map((g) => g.id));
  const labelOf = new Map(props.nodes.map((n) => [n.id, n.label]));
  const groupLabelOf = new Map(groups.map((g) => [g.id, g.label]));

  const childrenByGroup = new Map<string, ElkNode[]>();
  const topChildren: ElkNode[] = [];
  for (const n of props.nodes) {
    const s = nodeSize(n.label);
    const en: ElkNode = { id: n.id, width: s.width, height: s.height };
    if (n.parent && groupIds.has(n.parent)) {
      const arr = childrenByGroup.get(n.parent) ?? [];
      arr.push(en);
      childrenByGroup.set(n.parent, arr);
    } else {
      topChildren.push(en);
    }
  }

  const groupNodes: ElkNode[] = groups.map((g) => ({
    id: g.id,
    labels: [
      {
        text: g.label,
        width: g.label.length * 6.6 + 14,
        height: 18,
        layoutOptions: { 'elk.nodeLabels.placement': 'H_LEFT V_TOP INSIDE' },
      },
    ],
    layoutOptions: {
      'elk.direction': 'DOWN',
      'elk.padding': '[top=16,left=16,bottom=16,right=16]',
      'elk.spacing.nodeNode': '34',
      'elk.layered.spacing.nodeNodeBetweenLayers': '46',
    },
    children: childrenByGroup.get(g.id) ?? [],
  }));

  const edgeMeta = new Map<string, ElkFlowEdge>();
  const elkEdges = props.edges.map((e, i) => {
    const id = `e${i}`;
    edgeMeta.set(id, e);
    return {
      id,
      sources: [e.source],
      targets: [e.target],
      labels: e.label
        ? [{ text: e.label, width: e.label.length * 6.2 + 8, height: 16 }]
        : [],
    };
  });

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': dir,
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      'elk.spacing.nodeNode': '44',
      'elk.layered.spacing.nodeNodeBetweenLayers': '56',
      'elk.spacing.edgeNode': '26',
      'elk.spacing.edgeEdge': '18',
      'elk.spacing.edgeLabel': '6',
      'elk.layered.spacing.edgeNodeBetweenLayers': '26',
    },
    children: [...groupNodes, ...topChildren],
    edges: elkEdges,
  };

  const laid = await elk.layout(graph);

  const nodes: DrawNode[] = [];
  const drawGroups: DrawGroup[] = [];
  const drawEdges: DrawEdge[] = [];
  const edgeLabels: DrawLabel[] = [];

  const walk = (container: ElkNode, ax: number, ay: number): void => {
    for (const e of container.edges ?? []) {
      const meta = edgeMeta.get(e.id ?? '');
      for (const sec of e.sections ?? []) {
        const raw = [sec.startPoint, ...(sec.bendPoints ?? []), sec.endPoint];
        drawEdges.push({
          pts: raw.map((p) => ({ x: ax + p.x, y: ay + p.y })),
          dashed: !!meta?.dashed,
          bi: !!meta?.bi,
        });
      }
      for (const lab of e.labels ?? []) {
        edgeLabels.push({
          x: ax + (lab.x ?? 0),
          y: ay + (lab.y ?? 0),
          w: lab.width ?? 0,
          h: lab.height ?? 0,
          text: lab.text ?? '',
        });
      }
    }
    for (const child of container.children ?? []) {
      const cx = ax + (child.x ?? 0);
      const cy = ay + (child.y ?? 0);
      if (groupIds.has(child.id)) {
        const lab = child.labels?.[0];
        drawGroups.push({
          x: cx,
          y: cy,
          w: child.width ?? 0,
          h: child.height ?? 0,
          label: groupLabelOf.get(child.id) ?? '',
          lx: cx + (lab?.x ?? 10),
          ly: cy + (lab?.y ?? 8),
          lw: lab?.width ?? 0,
          lh: lab?.height ?? 18,
        });
        walk(child, cx, cy);
      } else {
        nodes.push({
          x: cx,
          y: cy,
          w: child.width ?? 0,
          h: child.height ?? 0,
          label: labelOf.get(child.id) ?? child.id,
        });
      }
    }
  };
  walk(laid, 0, 0);

  return {
    width: laid.width ?? 600,
    height: laid.height ?? 300,
    nodes,
    groups: drawGroups,
    edges: drawEdges,
    edgeLabels,
  };
}

function polyline(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

export function ElkFlow(props: ElkFlowProps) {
  const [laid, setLaid] = useState<Laid | null>(null);

  useEffect(() => {
    let cancelled = false;
    void layout(props).then((l) => {
      if (!cancelled) setLaid(l);
    });
    return () => {
      cancelled = true;
    };
  }, [props]);

  if (!laid) {
    return (
      <div className="not-prose my-6 h-64 animate-pulse rounded-lg border border-fd-border bg-fd-card" />
    );
  }

  const pad = 10;
  const w = laid.width + pad * 2;
  const h = laid.height + pad * 2;

  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-3">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full"
        style={{ maxWidth: w, fontFamily: 'ui-monospace, monospace' }}
      >
        <defs>
          <marker
            id="elk-arrow"
            markerWidth={9}
            markerHeight={8}
            refX={7}
            refY={3}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill={MUTED} />
          </marker>
        </defs>

        <g transform={`translate(${pad},${pad})`}>
          {laid.groups.map((g, i) => (
            <rect
              key={`g-${i}`}
              x={g.x}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={8}
              fill={SECONDARY}
              fillOpacity={0.28}
              stroke={BORDER}
            />
          ))}

          {laid.edges.map((e, i) => (
            <path
              key={`e-${i}`}
              d={polyline(e.pts)}
              fill="none"
              stroke={MUTED}
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={e.dashed ? '5 5' : undefined}
              markerEnd="url(#elk-arrow)"
              markerStart={e.bi ? 'url(#elk-arrow)' : undefined}
            />
          ))}

          {laid.edgeLabels.map((l, i) => (
            <g key={`el-${i}`}>
              <rect
                x={l.x - 2}
                y={l.y}
                width={l.w + 4}
                height={l.h}
                rx={3}
                fill={CARD}
                fillOpacity={0.92}
              />
              <text
                x={l.x + l.w / 2}
                y={l.y + l.h / 2 + 3.5}
                fontSize={11}
                textAnchor="middle"
                fill={FG}
              >
                {l.text}
              </text>
            </g>
          ))}

          {laid.groups.map((g, i) => (
            <g key={`gl-${i}`}>
              <rect
                x={g.lx - 4}
                y={g.ly - 1}
                width={g.lw + 8}
                height={g.lh + 2}
                rx={4}
                fill={CARD}
              />
              <text
                x={g.lx + g.lw / 2}
                y={g.ly + g.lh / 2 + 4}
                fontSize={11.5}
                fontWeight={600}
                textAnchor="middle"
                fill={PRIMARY}
              >
                {g.label}
              </text>
            </g>
          ))}

          {laid.nodes.map((n, i) => {
            const ls = n.label.split('\n');
            return (
              <g key={`n-${i}`}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx={6}
                  fill={CARD}
                  stroke={PRIMARY}
                  strokeOpacity={0.45}
                />
                {ls.map((line, j) => (
                  <text
                    key={j}
                    x={n.x + n.w / 2}
                    y={n.y + n.h / 2 - (ls.length - 1) * 8 + j * 16 + 4}
                    fontSize={12}
                    textAnchor="middle"
                    fill={FG}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export type { ReactNode };
