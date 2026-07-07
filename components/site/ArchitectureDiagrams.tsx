'use client';

import { Mermaid } from '@/components/site/Mermaid';

const SYSTEM = `graph TB
    Browser([Your browser])

    subgraph Vercel [Vercel]
        direction TB
        Pages[Static MDX pages]
        Twin[Twin chat API<br>Node serverless]
        Index[(RAG index<br>built at deploy)]
        Twin --> Index
    end

    subgraph Gemini [Google Gemini]
        direction TB
        Embed[Embeddings]
        Chat[Chat model]
    end

    subgraph Space [Hugging Face Space]
        Game[FastAPI + PPO<br>Docker on CPU]
    end

    Browser -->|read| Pages
    Browser -->|ask| Twin
    Browser -->|play| Game
    Twin -->|embed + generate| Embed
    Twin --> Chat`;

const TWIN = `graph LR
    subgraph Deploy [At deploy time]
        direction TB
        Corpus[(Knowledge corpus)]
        Chunk[Deterministic chunker]
        BM25[(BM25 index)]
        Vec[(Embeddings<br>768-dim)]
        Corpus --> Chunk
        Chunk --> BM25
        Chunk --> Vec
    end

    subgraph Ask [Per question]
        direction TB
        Q[Your question]
        Eq[Embed query]
        Lex[BM25 search]
        RRF{Rank fusion<br>RRF}
        Top[(Top k chunks)]
        Gen[Grounded answer<br>Gemini]
        Trace[Retrieval trace<br>shown to you]
        Q --> Eq
        Q --> Lex
        Eq --> RRF
        Lex --> RRF
        RRF --> Top
        Top --> Gen
        Top --> Trace
    end

    Vec -.->|vector search| RRF
    BM25 -.->|keyword search| RRF`;

const GAME = `sequenceDiagram
    autonumber
    participant P as Player (browser)
    participant API as FastAPI (HF Space)
    participant E as Game engine
    participant M as PPO policy

    P->>API: POST /game/move (direction)
    API->>E: apply move, recompute senses
    alt game still ongoing
        E->>M: observation (scent, positions)
        M-->>E: Wumpus move
        E->>E: resolve pits, gold, capture
    end
    API-->>P: new state, senses, message
    Note over P,API: One arrow per game, fired straight down a corridor`;

export function SystemOverview() {
  return <Mermaid chart={SYSTEM} />;
}

export function TwinPipeline() {
  return <Mermaid chart={TWIN} />;
}

export function GameRuntime() {
  return <Mermaid chart={GAME} />;
}
