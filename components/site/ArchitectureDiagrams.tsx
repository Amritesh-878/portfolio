'use client';

import { Mermaid } from '@/components/site/Mermaid';

const SYSTEM = `graph TB
    classDef client fill:#61dafb,stroke:#1f2937,stroke-width:2px,color:#000;
    classDef edge fill:#059669,stroke:#1f2937,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#1f2937,stroke-width:2px,color:#000;
    classDef infra fill:#6b7280,stroke:#1f2937,stroke-width:2px,color:#fff;

    Browser([Your browser]):::client

    subgraph Vercel [Vercel]
        direction TB
        Pages[Static MDX pages]:::client
        Twin[Twin chat API<br>Node serverless]:::edge
        Index[(RAG index<br>built at deploy)]:::infra
        Twin --> Index
    end

    subgraph Gemini [Google Gemini]
        direction TB
        Embed[Embeddings]:::ai
        Chat[Chat model]:::ai
    end

    subgraph Space [Hugging Face Space]
        Game[FastAPI + PPO<br>Docker on CPU]:::edge
    end

    Browser -->|read| Pages
    Browser -->|ask| Twin
    Browser -->|play| Game
    Twin -->|embed + generate| Embed
    Twin --> Chat`;

const TWIN = `graph LR
    classDef data fill:#6b7280,stroke:#1f2937,stroke-width:2px,color:#fff;
    classDef proc fill:#059669,stroke:#1f2937,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#1f2937,stroke-width:2px,color:#000;

    subgraph Deploy [At deploy time]
        direction TB
        Corpus[(Knowledge corpus)]:::data
        Chunk[Deterministic chunker]:::proc
        BM25[(BM25 index)]:::data
        Vec[(Embeddings<br>768-dim)]:::data
        Corpus --> Chunk
        Chunk --> BM25
        Chunk --> Vec
    end

    subgraph Ask [Per question]
        direction TB
        Q[Your question]:::proc
        Eq[Embed query]:::ai
        Lex[BM25 search]:::proc
        RRF{Rank fusion<br>RRF}:::proc
        Top[(Top k chunks)]:::data
        Gen[Grounded answer<br>Gemini]:::ai
        Trace[Retrieval trace<br>shown to you]:::proc
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

const GAME = `graph LR
    classDef client fill:#61dafb,stroke:#1f2937,stroke-width:2px,color:#000;
    classDef backend fill:#059669,stroke:#1f2937,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#1f2937,stroke-width:2px,color:#000;

    subgraph Page [In the page, no iframe]
        direction TB
        Ctl[Keyboard + D-pad]:::client
        Board[Board + HUD<br>React]:::client
        Ctl --> Board
    end

    subgraph Space [Hugging Face Space]
        direction TB
        API[FastAPI<br>start and move]:::backend
        Engine[Game engine<br>senses, pits, gold]:::backend
        Policy[PPO policy<br>per difficulty]:::ai
        API --> Engine
        Engine -->|observation| Policy
        Policy -->|wumpus move| Engine
    end

    Board <-->|HTTP JSON| API`;

export function SystemOverview() {
  return <Mermaid chart={SYSTEM} />;
}

export function TwinPipeline() {
  return <Mermaid chart={TWIN} />;
}

export function GameRuntime() {
  return <Mermaid chart={GAME} />;
}
