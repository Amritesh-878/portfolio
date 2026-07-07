'use client';

import { ElkFlow, type ElkFlowProps } from '@/components/site/ElkFlow';
import { Sequence, type SequenceProps } from '@/components/site/Sequence';

const ARCHITECTURE: ElkFlowProps = {
  direction: 'DOWN',
  groups: [
    { id: 'Client', label: 'Browser (React + Vite)' },
    { id: 'Server', label: 'FastAPI backend' },
    { id: 'RL', label: 'Reinforcement learning' },
  ],
  nodes: [
    { id: 'Input', label: 'useControls hook', parent: 'Client' },
    { id: 'UI', label: 'Game UI and modals', parent: 'Client' },
    { id: 'Board', label: 'Grid and tiles', parent: 'Client' },
    { id: 'Endpoints', label: 'API routes\n/start, /move', parent: 'Server' },
    { id: 'Engine', label: 'Core game engine', parent: 'Server' },
    { id: 'Agent', label: 'Wumpus agent\nPPO model', parent: 'RL' },
  ],
  edges: [
    { source: 'Input', target: 'UI', label: 'triggers actions', dashed: true },
    { source: 'UI', target: 'Board', label: 'renders state', dashed: true },
    { source: 'UI', target: 'Endpoints', label: 'HTTP REST JSON' },
    { source: 'Endpoints', target: 'Engine' },
    { source: 'Engine', target: 'Agent', label: 'observation, move' },
  ],
};

const TRAINING: SequenceProps = {
  autonumber: true,
  participants: [
    { id: 'Env', label: 'Gymnasium Env\n(HunterWumpus)' },
    { id: 'PPO', label: 'PPO Agent\n(SB3)' },
    { id: 'Eval', label: 'EvalCallback' },
    { id: 'Disk', label: 'Checkpoints' },
  ],
  steps: [
    { note: ['Env', 'PPO'], text: 'Phase 1: Experience Collection' },
    {
      frame: 'loop',
      label: 'Rollout Buffer (2048 steps)',
      steps: [
        { msg: ['Env', 'PPO'], text: '9D observation (scent, pos)' },
        { msg: ['PPO', 'Env'], text: 'discrete action (N/S/E/W)' },
        { msg: ['Env', 'PPO'], text: 'reward, done, info' },
      ],
    },
    { note: ['PPO', 'Disk'], text: 'Phase 2: Policy Optimization' },
    { msg: ['PPO', 'PPO'], text: 'compute advantages (GAE)' },
    { msg: ['PPO', 'PPO'], text: 'update actor-critic net' },
    {
      frame: 'opt',
      label: 'Every 10,000 timesteps',
      steps: [
        { msg: ['PPO', 'Eval'], text: 'trigger evaluation' },
        { msg: ['Eval', 'Env'], text: 'run test episodes' },
        { msg: ['Env', 'Eval'], text: 'return mean reward', dashed: true },
        { msg: ['Eval', 'Disk'], text: 'save best_model.zip' },
      ],
    },
    { note: ['PPO', 'Disk'], text: 'End of training (1M timesteps)' },
    { msg: ['PPO', 'Disk'], text: 'save final_model.zip' },
  ],
};

export function WumpusArchitecture() {
  return <ElkFlow {...ARCHITECTURE} />;
}

export function WumpusTraining() {
  return <Sequence {...TRAINING} />;
}
