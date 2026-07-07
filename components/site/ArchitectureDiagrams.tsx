'use client';

import { ElkFlow, type ElkFlowProps } from '@/components/site/ElkFlow';
import { Sequence, type SequenceProps } from '@/components/site/Sequence';

const SYSTEM: ElkFlowProps = {
  direction: 'DOWN',
  groups: [
    { id: 'Vercel', label: 'Vercel' },
    { id: 'Gemini', label: 'Google Gemini' },
    { id: 'Space', label: 'Hugging Face Space' },
  ],
  nodes: [
    { id: 'Browser', label: 'Your browser' },
    { id: 'Pages', label: 'Static MDX pages', parent: 'Vercel' },
    { id: 'Twin', label: 'Twin chat API\nNode serverless', parent: 'Vercel' },
    { id: 'Index', label: 'RAG index\nbuilt at deploy', parent: 'Vercel' },
    { id: 'Embed', label: 'Embeddings', parent: 'Gemini' },
    { id: 'Chat', label: 'Chat model', parent: 'Gemini' },
    { id: 'Game', label: 'FastAPI + PPO\nDocker on CPU', parent: 'Space' },
  ],
  edges: [
    { source: 'Twin', target: 'Index' },
    { source: 'Browser', target: 'Pages', label: 'read' },
    { source: 'Browser', target: 'Twin', label: 'ask' },
    { source: 'Browser', target: 'Game', label: 'play' },
    { source: 'Twin', target: 'Embed', label: 'embed + generate' },
    { source: 'Twin', target: 'Chat' },
  ],
};

const TWIN: ElkFlowProps = {
  direction: 'DOWN',
  groups: [
    { id: 'Deploy', label: 'At deploy time' },
    { id: 'Ask', label: 'Per question' },
  ],
  nodes: [
    { id: 'Corpus', label: 'Knowledge corpus', parent: 'Deploy' },
    { id: 'Chunk', label: 'Deterministic chunker', parent: 'Deploy' },
    { id: 'BM25', label: 'BM25 index', parent: 'Deploy' },
    { id: 'Vec', label: 'Embeddings\n768-dim', parent: 'Deploy' },
    { id: 'Q', label: 'Your question', parent: 'Ask' },
    { id: 'Eq', label: 'Embed query', parent: 'Ask' },
    { id: 'Lex', label: 'BM25 search', parent: 'Ask' },
    { id: 'RRF', label: 'Rank fusion\nRRF', parent: 'Ask' },
    { id: 'Top', label: 'Top k chunks', parent: 'Ask' },
    { id: 'Gen', label: 'Grounded answer\nGemini', parent: 'Ask' },
    { id: 'Trace', label: 'Retrieval trace\nshown to you', parent: 'Ask' },
  ],
  edges: [
    { source: 'Corpus', target: 'Chunk' },
    { source: 'Chunk', target: 'BM25' },
    { source: 'Chunk', target: 'Vec' },
    { source: 'Q', target: 'Eq' },
    { source: 'Q', target: 'Lex' },
    { source: 'Eq', target: 'RRF' },
    { source: 'Lex', target: 'RRF' },
    { source: 'RRF', target: 'Top' },
    { source: 'Top', target: 'Gen' },
    { source: 'Top', target: 'Trace' },
    { source: 'Vec', target: 'RRF', dashed: true },
    { source: 'BM25', target: 'RRF', dashed: true },
  ],
};

const GAME: SequenceProps = {
  autonumber: true,
  participants: [
    { id: 'P', label: 'Player (browser)' },
    { id: 'API', label: 'FastAPI (HF Space)' },
    { id: 'E', label: 'Game engine' },
    { id: 'M', label: 'PPO policy' },
  ],
  steps: [
    { msg: ['P', 'API'], text: 'POST /game/move (direction)' },
    { msg: ['API', 'E'], text: 'apply move, recompute senses' },
    {
      frame: 'alt',
      label: 'game still ongoing',
      steps: [
        { msg: ['E', 'M'], text: 'observation (scent, positions)' },
        { msg: ['M', 'E'], text: 'Wumpus move', dashed: true },
        { msg: ['E', 'E'], text: 'resolve pits, gold, capture' },
      ],
    },
    { msg: ['API', 'P'], text: 'new state, senses, message', dashed: true },
    {
      note: ['P', 'API'],
      text: 'One arrow per game, fired straight down a corridor',
    },
  ],
};

export function SystemOverview() {
  return <ElkFlow {...SYSTEM} />;
}

export function TwinPipeline() {
  return <ElkFlow {...TWIN} />;
}

export function GameRuntime() {
  return <Sequence {...GAME} />;
}
