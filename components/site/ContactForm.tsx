'use client';

import Script from 'next/script';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface Receipt {
  id: string | null;
  routedTo: string;
}

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      appearance?: 'always' | 'execute' | 'interaction-only';
      theme?: 'auto' | 'light' | 'dark';
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const PUBLIC_ADDRESS = 'contact@amritesh.net';

const inputClass =
  'w-full rounded-md border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none transition-colors placeholder:text-fd-muted-foreground/60 focus:border-fd-primary';

function MailFallback({ lead }: { lead: string }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-6 text-sm text-fd-muted-foreground">
      {lead}{' '}
      <a
        className="text-fd-primary hover:underline"
        href={`mailto:${PUBLIC_ADDRESS}`}
      >
        {PUBLIC_ADDRESS}
      </a>
      .
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const tokenRef = useRef<string>('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Explicit render on script-ready; next/script's onReady also fires on remount
  // (Fumadocs navigates client-side), so the widget survives route changes.
  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !widgetRef.current || widgetIdRef.current !== null) return;
    if (!window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: SITE_KEY,
      appearance: 'interaction-only',
      theme: 'auto',
      callback: (token) => {
        tokenRef.current = token;
      },
      'expired-callback': () => {
        tokenRef.current = '';
      },
      'error-callback': () => {
        tokenRef.current = '';
      },
    });
  }, []);

  const resetWidget = useCallback(() => {
    tokenRef.current = '';
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  // Turnstile mounts an iframe into widgetRef; React unmounting that container
  // (on success or navigation) orphans it in Cloudflare's registry, so remove it.
  useEffect(() => {
    return () => {
      const id = widgetIdRef.current;
      if (id !== null && window.turnstile) window.turnstile.remove(id);
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const token = tokenRef.current;
    if (!token) {
      setStatus('error');
      setError('Human check is still loading. Give it a second and try again.');
      return;
    }

    setStatus('sending');
    setError('');

    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''),
      token,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        id?: string | null;
        routedTo?: string;
        error?: string;
      } | null;
      if (response.ok && result?.ok) {
        // The success view drops the widget container, so remove the Turnstile
        // instance first or Cloudflare warns about an orphaned widget.
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        setReceipt({
          id: result.id ?? null,
          routedTo: result.routedTo ?? PUBLIC_ADDRESS,
        });
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
        setError(result?.error ?? 'Something went wrong. Try email instead.');
        resetWidget();
      }
    } catch {
      setStatus('error');
      setError('Network error. Try email instead.');
      resetWidget();
    }
  };

  if (!SITE_KEY) {
    return (
      <MailFallback lead="The contact form isn't wired up yet. Email me directly at" />
    );
  }

  if (status === 'sent') {
    return (
      <div className="not-prose my-6 rounded-lg border border-fd-primary/40 bg-fd-card p-6">
        <p className="font-mono text-sm text-fd-primary">message delivered</p>
        <dl className="mt-3 grid gap-1.5 font-mono text-xs text-fd-muted-foreground">
          <div className="flex justify-between gap-4">
            <dt>verified</dt>
            <dd className="text-fd-foreground">human · Turnstile</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>routed to</dt>
            <dd className="text-fd-foreground">{receipt?.routedTo}</dd>
          </div>
          {receipt?.id ? (
            <div className="flex justify-between gap-4">
              <dt>reference</dt>
              <dd className="truncate text-fd-foreground">{receipt.id}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Thanks for reaching out. I&apos;ll reply by email, usually within a
          day or two.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <form
        onSubmit={onSubmit}
        className="not-prose @container my-6 flex flex-col gap-4 rounded-lg border border-fd-border bg-fd-card p-6"
      >
        <div>
          <h3 className="font-mono text-sm font-medium text-fd-foreground">
            Send a message
          </h3>
          <p className="mt-1 text-xs text-fd-muted-foreground">
            Verified, then routed to {PUBLIC_ADDRESS}. I usually reply within a
            day or two.
          </p>
        </div>
        <div className="grid gap-4 @md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
            Name
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
              placeholder="Your name"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
          Subject
          <input
            name="subject"
            type="text"
            required
            className={inputClass}
            placeholder="What's this about?"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
          Message
          <textarea
            name="message"
            required
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="Tell me a bit about it."
          />
        </label>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <input
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <div ref={widgetRef} />
        {status === 'error' ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-fd-primary px-4 py-2 font-mono text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'sending' ? 'sending…' : 'send message →'}
        </button>
      </form>
    </>
  );
}
