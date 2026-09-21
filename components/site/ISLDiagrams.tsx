'use client';

import { ElkFlow, type ElkFlowProps } from '@/components/site/ElkFlow';

const TEXT_TO_SQL: ElkFlowProps = {
  direction: 'DOWN',
  groups: [
    { id: 'Ingest', label: 'Ingest (once)' },
    { id: 'Query', label: 'Per question' },
  ],
  nodes: [
    { id: 'Excel', label: 'Survey exports\nmultilingual', parent: 'Ingest' },
    { id: 'Map', label: 'Column mapping', parent: 'Ingest' },
    { id: 'Norm', label: 'Answer\nnormalization', parent: 'Ingest' },
    { id: 'DB', label: 'Normalized\ndatabase', parent: 'Ingest' },
    { id: 'Q', label: 'Plain-English\nquestion', parent: 'Query' },
    { id: 'Prompt', label: 'Schema prompt', parent: 'Query' },
    { id: 'SQL', label: 'LLM to read-only\nSQL', parent: 'Query' },
    { id: 'Guard', label: 'Guarded run\naggregate only', parent: 'Query' },
    { id: 'Ans', label: 'Narrated answer', parent: 'Query' },
  ],
  edges: [
    { source: 'Excel', target: 'Map' },
    { source: 'Map', target: 'Norm' },
    { source: 'Norm', target: 'DB' },
    { source: 'Q', target: 'Prompt' },
    { source: 'Prompt', target: 'SQL' },
    { source: 'SQL', target: 'Guard' },
    { source: 'Guard', target: 'Ans' },
    { source: 'DB', target: 'Prompt', dashed: true },
    { source: 'DB', target: 'Guard', dashed: true },
  ],
};

const CLASS_RAG: ElkFlowProps = {
  direction: 'RIGHT',
  nodes: [
    { id: 'Audio', label: 'Class recording\nper student' },
    { id: 'WX', label: 'WhisperX\ntranscription' },
    { id: 'Mat', label: 'Class materials\nslides, notes' },
    { id: 'Chunk', label: 'Chunking' },
    { id: 'Store', label: 'Vector store\nper-student scope' },
    { id: 'Chat', label: 'Grounded chat\nsource-attributed' },
  ],
  edges: [
    { source: 'Audio', target: 'WX' },
    { source: 'WX', target: 'Chunk' },
    { source: 'Mat', target: 'Chunk' },
    { source: 'Chunk', target: 'Store' },
    { source: 'Store', target: 'Chat' },
  ],
};

const EXAM_PAPER: ElkFlowProps = {
  direction: 'RIGHT',
  nodes: [
    { id: 'Doc', label: 'Teacher writes\nthe paper in a Doc' },
    { id: 'Review', label: 'Flagged questions\nreviewed' },
    { id: 'Publish', label: 'Published and\nassigned to classes' },
    { id: 'Sit', label: 'Students sit\nthe paper' },
    { id: 'Mark', label: 'Marked\nteacher decides' },
    { id: 'Release', label: 'Results released' },
  ],
  edges: [
    { source: 'Doc', target: 'Review' },
    { source: 'Review', target: 'Publish' },
    { source: 'Publish', target: 'Sit' },
    { source: 'Sit', target: 'Mark' },
    { source: 'Mark', target: 'Release' },
  ],
};

export function TextToSqlPipeline() {
  return <ElkFlow {...TEXT_TO_SQL} />;
}

export function ClassRecordingPipeline() {
  return <ElkFlow {...CLASS_RAG} />;
}

export function ExamPaperFlow() {
  return <ElkFlow {...EXAM_PAPER} />;
}
