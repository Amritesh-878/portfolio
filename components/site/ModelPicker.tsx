'use client';

import { useEffect, useRef, useState } from 'react';

import type { ChatModelChoice } from '@/lib/chat/schema';

const HINT =
  'twin-llm is a small model tuned on my own writing. Slower, but mine.';

interface ModelPickerProps {
  value: ChatModelChoice;
  onChange: (value: ChatModelChoice) => void;
  twinAvailable: boolean;
}

export function ModelPicker({
  value,
  onChange,
  twinAvailable,
}: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (choice: ChatModelChoice) => {
    onChange(choice);
    setOpen(false);
  };

  // No `relative` here: the panel anchors to the form row (the nearest
  // positioned ancestor) so it can span the bar's full width on small screens.
  return (
    <div ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose which model answers"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-full items-center gap-1 rounded-full border border-fd-border px-3 font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/60 hover:text-fd-primary"
      >
        {value === 'twin' ? 'twin-llm' : 'auto'}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M3 7.5 6 4.5 9 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Model"
          className="absolute inset-x-3 bottom-full z-10 mb-2 rounded-lg border border-fd-border bg-fd-card p-1 text-sm shadow-md sm:inset-x-auto sm:right-3 sm:w-64"
        >
          <div className="px-2 pb-1 pt-1.5 font-mono text-xs text-fd-muted-foreground">
            model
          </div>
          <button
            type="button"
            role="option"
            aria-selected={value === 'auto'}
            onClick={() => pick('auto')}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-fd-foreground transition-colors hover:bg-fd-secondary"
          >
            <span>Auto</span>
            {value === 'auto' ? <span aria-hidden="true">✓</span> : null}
          </button>
          {twinAvailable ? (
            <button
              type="button"
              role="option"
              aria-selected={value === 'twin'}
              onClick={() => pick('twin')}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-fd-foreground transition-colors hover:bg-fd-secondary"
            >
              <span>twin-llm</span>
              {value === 'twin' ? <span aria-hidden="true">✓</span> : null}
            </button>
          ) : (
            <div
              role="option"
              aria-selected={false}
              aria-disabled="true"
              className="flex w-full cursor-not-allowed items-center justify-between px-2 py-1.5 text-fd-muted-foreground/60"
            >
              <span>twin-llm</span>
              <span className="rounded border border-fd-border px-1.5 py-0.5 font-mono text-[10px]">
                under construction
              </span>
            </div>
          )}
          <div className="mt-1 border-t border-fd-border px-2 py-1.5 text-xs leading-relaxed text-fd-muted-foreground">
            {HINT}
          </div>
        </div>
      ) : null}
    </div>
  );
}
