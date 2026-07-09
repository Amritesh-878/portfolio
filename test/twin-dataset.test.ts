import { describe, it, expect } from 'vitest';

import {
  answerableSamples,
  injectionSamples,
  isTransientModelError,
  parseQaPairs,
  refusalSamples,
  serializeJsonl,
  toChatSample,
} from '../scripts/twin-dataset.mjs';

interface ChatSample {
  messages: Array<{ role: string; content: string }>;
}

function isWellFormed(sample: ChatSample): boolean {
  const roles = sample.messages.map((m) => m.role);
  return (
    roles.join(',') === 'system,user,assistant' &&
    sample.messages.every((m) => m.content.trim().length > 0)
  );
}

describe('toChatSample', () => {
  it('builds a system/user/assistant message triple', () => {
    const sample = toChatSample('SYS', 'Q', 'A') as ChatSample;
    expect(sample.messages).toEqual([
      { role: 'system', content: 'SYS' },
      { role: 'user', content: 'Q' },
      { role: 'assistant', content: 'A' },
    ]);
  });
});

describe('refusalSamples', () => {
  const samples = refusalSamples() as ChatSample[];

  it('drafts at least fifteen well-formed refusals', () => {
    expect(samples.length).toBeGreaterThanOrEqual(15);
    expect(samples.every(isWellFormed)).toBe(true);
  });

  it('embeds the runtime system prompt and redirects to email', () => {
    expect(samples[0].messages[0].content).toContain('Corpus only');
    expect(
      samples.some((s) =>
        s.messages[2].content.includes('contact@amritesh.net'),
      ),
    ).toBe(true);
  });
});

describe('injectionSamples', () => {
  const samples = injectionSamples() as ChatSample[];

  it('drafts at least ten well-formed deflections', () => {
    expect(samples.length).toBeGreaterThanOrEqual(10);
    expect(samples.every(isWellFormed)).toBe(true);
  });
});

describe('answerableSamples', () => {
  const chunk = {
    id: 'rl',
    heading: 'Reinforcement learning',
    text: 'I trained a PPO agent for Hunter Wumpus.',
    tokenEstimate: 10,
    sourceFile: 'knowledge.md',
  };

  it('grounds the system prompt in the chunk under the CONTEXT block', () => {
    const samples = answerableSamples(chunk, [
      { question: 'What RL have you done?', answer: 'A PPO agent.' },
    ]) as ChatSample[];
    expect(samples).toHaveLength(1);
    expect(isWellFormed(samples[0])).toBe(true);
    expect(samples[0].messages[0].content).toContain(
      'PPO agent for Hunter Wumpus',
    );
    expect(samples[0].messages[0].content).toContain('CONTEXT');
  });
});

describe('parseQaPairs', () => {
  it('parses a bare JSON array', () => {
    expect(
      parseQaPairs(
        '[{"question":"q1","answer":"a1"},{"question":"q2","answer":"a2"}]',
      ),
    ).toEqual([
      { question: 'q1', answer: 'a1' },
      { question: 'q2', answer: 'a2' },
    ]);
  });

  it('extracts the array from fenced or chatty output', () => {
    const text = 'Sure!\n```json\n[{"question":"q","answer":"a"}]\n```\n';
    expect(parseQaPairs(text)).toEqual([{ question: 'q', answer: 'a' }]);
  });

  it('drops malformed entries and returns [] on unparseable input', () => {
    expect(
      parseQaPairs('[{"question":"q"},{"question":"ok","answer":"yes"}]'),
    ).toEqual([{ question: 'ok', answer: 'yes' }]);
    expect(parseQaPairs('no json here')).toEqual([]);
  });
});

describe('serializeJsonl', () => {
  it('emits one JSON object per line, each round-tripping', () => {
    const samples = [toChatSample('s', 'u', 'a')];
    const jsonl = serializeJsonl(samples);
    const lines = jsonl.trimEnd().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0])).toEqual(samples[0]);
  });
});

describe('isTransientModelError', () => {
  it('flags overload, rate-limit, and quota shapes', () => {
    expect(
      isTransientModelError(
        new Error(
          '{"error":{"code":503,"message":"This model is currently experiencing high demand.","status":"UNAVAILABLE"}}',
        ),
      ),
    ).toBe(true);
    expect(isTransientModelError(new Error('got a 429 back'))).toBe(true);
    expect(isTransientModelError('RESOURCE_EXHAUSTED: quota')).toBe(true);
  });

  it('does not flag programming errors', () => {
    expect(isTransientModelError(new TypeError('x is not a function'))).toBe(
      false,
    );
    expect(isTransientModelError(new Error('GEMINI_API_KEY is not set.'))).toBe(
      false,
    );
  });
});
