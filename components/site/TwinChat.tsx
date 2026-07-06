'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

interface TraceEntry {
  id: string;
  heading: string;
  vecRank: number | null;
  bm25Rank: number | null;
  fusedScore: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTERS = [
  "What's the Wumpus paper about?",
  'What RAG systems has Amritesh built?',
  "What's his experience with reinforcement learning?",
  'Why should we interview him?',
  'What is this website built with?',
];

export function TwinChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle');
  const [error, setError] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (autoSent.current) return;
    const query = new URLSearchParams(window.location.search).get('q');
    if (query && query.trim()) {
      autoSent.current = true;
      // Clear the param so a refresh doesn't re-ask the handed-over query.
      window.history.replaceState({}, '', window.location.pathname);
      void send(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only handoff
  }, []);

  async function send(text: string): Promise<void> {
    const message = text.trim();
    if (!message || status === 'streaming') return;
    const history = messages.slice(-8);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    setStatus('streaming');
    setError('');
    setTrace([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? 'The twin is unavailable right now.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      let traceParsed = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const newline = full.indexOf('\n');
        if (newline === -1) continue;
        if (!traceParsed) {
          try {
            const head = JSON.parse(full.slice(0, newline)) as {
              trace: TraceEntry[];
            };
            setTrace(head.trace);
          } catch {
            /* trace is best-effort; the answer still streams */
          }
          traceParsed = true;
        }
        const answer = full.slice(newline + 1);
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: answer };
          return next;
        });
      }
      setStatus('idle');
    } catch (caught) {
      setStatus('error');
      setError(
        caught instanceof Error ? caught.message : 'Something went wrong.',
      );
      setMessages((prev) => prev.slice(0, -1));
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <div className="not-prose my-6 flex h-[70vh] min-h-[480px] flex-col">
      <div ref={threadRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div>
              <h2 className="font-mono text-lg font-medium text-fd-foreground">
                Ask my AI twin
              </h2>
              <p className="mt-1 text-sm text-fd-muted-foreground">
                I answer only from my corpus, and I show you the chunks behind
                every answer.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2">
              {STARTERS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  className="rounded-lg border border-fd-border px-4 py-2.5 text-left text-sm text-fd-muted-foreground transition-colors hover:border-fd-primary/60 hover:text-fd-primary"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={
                  message.role === 'user'
                    ? 'flex justify-end'
                    : 'flex flex-col gap-2'
                }
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm text-fd-foreground ${
                    message.role === 'user' ? 'self-end bg-fd-primary/10' : ''
                  }`}
                >
                  {message.content ||
                    (status === 'streaming' && i === messages.length - 1 ? (
                      <span className="text-fd-muted-foreground">
                        thinking…
                      </span>
                    ) : null)}
                </div>
                {message.role === 'assistant' &&
                i === messages.length - 1 &&
                trace.length > 0 ? (
                  <details className="max-w-[85%] rounded-md border border-fd-border bg-fd-background/40 text-xs">
                    <summary className="cursor-pointer px-3 py-2 font-mono text-fd-muted-foreground">
                      retrieval trace · {trace.length} chunks
                    </summary>
                    <div className="flex flex-col gap-1 px-3 pb-3 font-mono">
                      {trace.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between gap-3 text-fd-muted-foreground"
                        >
                          <span className="truncate text-fd-foreground">
                            {entry.heading}
                          </span>
                          <span className="shrink-0">
                            vec {entry.vecRank ?? '-'} · bm25{' '}
                            {entry.bm25Rank ?? '-'} ·{' '}
                            {entry.fusedScore.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="px-4 pb-2 text-sm text-red-500">{error}</p> : null}

      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-fd-border p-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the twin…"
          aria-label="Ask the AI twin a question"
          className="flex-1 rounded-full border border-fd-border bg-fd-background px-4 py-2.5 text-sm text-fd-foreground outline-none transition-colors placeholder:text-fd-muted-foreground/60 focus:border-fd-primary"
        />
        <button
          type="submit"
          disabled={status === 'streaming' || input.trim().length === 0}
          className="rounded-full bg-fd-primary px-5 py-2.5 font-mono text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'streaming' ? '…' : 'ask'}
        </button>
      </form>
    </div>
  );
}
