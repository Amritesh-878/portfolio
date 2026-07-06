'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const inputClass =
  'w-full rounded-md border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground outline-none transition-colors placeholder:text-fd-muted-foreground/60 focus:border-fd-primary';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ACCESS_KEY) return;
    const form = event.currentTarget;
    setStatus('sending');
    setError('');

    const payload = new FormData(form);
    payload.append('access_key', ACCESS_KEY);
    payload.append('from_name', 'Portfolio contact form');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
      });
      const result: { success: boolean; message?: string } =
        await response.json();
      if (result.success) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
        setError(result.message ?? 'Something went wrong. Try email instead.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Try email instead.');
    }
  };

  if (!ACCESS_KEY) {
    return (
      <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card p-6 text-sm text-fd-muted-foreground">
        The contact form isn&apos;t wired up yet. Email me directly at{' '}
        <a
          className="text-fd-primary hover:underline"
          href="mailto:amritesh.praveen@gmail.com"
        >
          amritesh.praveen@gmail.com
        </a>
        .
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="not-prose my-6 rounded-lg border border-fd-primary/40 bg-fd-card p-6">
        <p className="font-mono text-sm text-fd-primary">message sent</p>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          Thanks for reaching out. I&apos;ll get back to you by email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="not-prose @container my-6 flex flex-col gap-4 rounded-lg border border-fd-border bg-fd-card p-6"
    >
      <div>
        <h3 className="font-mono text-sm font-medium text-fd-foreground">
          Send a message
        </h3>
        <p className="mt-1 text-xs text-fd-muted-foreground">
          Goes straight to my inbox. I usually reply within a day or two.
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
  );
}
