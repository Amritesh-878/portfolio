'use client';

import { Mermaid } from '@/components/site/Mermaid';

const ARCHITECTURE = `graph LR
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#059669,stroke:#333,stroke-width:2px,color:#fff;
    classDef ai fill:#f59e0b,stroke:#333,stroke-width:2px,color:#000;

    subgraph Client [Browser - React and Vite]
        direction TB
        Input[useControls Hook]:::frontend
        UI[Game UI and Modals]:::frontend
        Board[Grid and Tiles]:::frontend

        Input -.->|Triggers Actions| UI
        UI -.->|Renders State| Board
    end

    subgraph Server [FastAPI Backend]
        direction TB
        Endpoints[API Routes<br>/start, /move]:::backend
        Engine[Core Game Engine]:::backend

        Endpoints <-->|Validates and Routes| Engine
    end

    subgraph RL [Reinforcement Learning]
        Agent{Wumpus Agent<br>PPO Model}:::ai
    end

    Client <-->|HTTP REST JSON| Endpoints
    Engine <-->|Observations and Next Move| Agent`;

const TRAINING = `sequenceDiagram
    autonumber
    participant Env as Gymnasium Env<br>(HunterWumpus 4x4)
    participant PPO as PPO Agent<br>(Stable-Baselines3)
    participant Eval as EvalCallback<br>(Monitor)
    participant Disk as File System<br>(Checkpoints)

    Note over Env, PPO: Phase 1: Experience Collection

    loop Rollout Buffer (2048 steps)
        Env->>PPO: 9D Observation Vector (Scent, Pos)
        PPO->>Env: Discrete Action (N, S, E, W)
        Env->>PPO: Reward, Done Flag, Info Dict
    end

    Note over PPO, Disk: Phase 2: Policy Optimization and Callbacks

    PPO->>PPO: Compute Advantages (GAE)
    PPO->>PPO: Update Actor-Critic Networks<br>(10 Epochs, Batch Size 64)

    opt Every 10,000 Timesteps
        PPO->>Eval: Trigger Periodic Evaluation
        Eval->>Env: Run Deterministic Test Episodes
        Env-->>Eval: Return Mean Reward
        Eval->>Disk: Save best_model.zip (If Improved)
    end

    Note over PPO, Disk: End of Training (1,000,000 Timesteps)
    PPO->>Disk: Save final_wumpus_model.zip`;

export function WumpusArchitecture() {
  return <Mermaid chart={ARCHITECTURE} />;
}

export function WumpusTraining() {
  return <Mermaid chart={TRAINING} />;
}
