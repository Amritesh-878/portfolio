'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ResumeLightbox } from '@/components/site/ResumeLightbox';

const PHONE_QUERY = '(max-width: 639px)';
const WORKER_SRC = '/pdf.worker.min.mjs';

// Rendered well above display size so pinch-zoom has real pixels to draw from.
const MIN_RENDER_WIDTH = 1500;
const MAX_RENDER_WIDTH = 2400;

type Status = 'idle' | 'rendering' | 'ready' | 'failed';

export function ResumePages({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY);
    if (!phone.matches) return;

    let cancelled = false;
    const canvases: HTMLCanvasElement[] = [];

    async function render() {
      const container = containerRef.current;
      if (!container) return;
      setStatus('rendering');
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
        const doc = await pdfjs.getDocument({ url: src }).promise;
        const width = container.clientWidth;
        const ratio = Math.min(window.devicePixelRatio || 1, 3);
        const renderWidth = Math.min(
          Math.max(width * ratio * 2, MIN_RENDER_WIDTH),
          MAX_RENDER_WIDTH,
        );

        for (let number = 1; number <= doc.numPages; number += 1) {
          if (cancelled) break;
          const page = await doc.getPage(number);
          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: renderWidth / unscaled.width,
          });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) throw new Error('canvas 2d context unavailable');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className =
            'w-full rounded-lg border border-fd-border bg-white';
          canvas.setAttribute(
            'aria-label',
            `Résumé of Amritesh Praveen, page ${number}`,
          );
          container.append(canvas);
          canvases.push(canvas);
          await page.render({ canvas, canvasContext: context, viewport })
            .promise;
        }
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('failed');
      }
    }

    void render();

    return () => {
      cancelled = true;
      for (const canvas of canvases) canvas.remove();
    };
  }, [src]);

  return (
    <>
      <div className="mt-4 sm:hidden">
        <div className="relative">
          <div ref={containerRef} className="flex flex-col gap-3" />
          {status === 'ready' ? (
            <button
              type="button"
              aria-label="Open the résumé full screen"
              onClick={() => setOpen(true)}
              className="absolute inset-0 flex items-end justify-end rounded-lg p-2"
            >
              <span className="rounded-md bg-neutral-900/85 px-2 py-1 font-mono text-xs text-neutral-100">
                tap to zoom
              </span>
            </button>
          ) : null}
        </div>
        {status === 'rendering' ? (
          <p className="text-sm text-fd-muted-foreground">Drawing the pages.</p>
        ) : null}
        {status === 'failed' ? (
          <p className="text-sm text-fd-muted-foreground">
            The pages would not draw on this browser, so open the PDF with the
            button above.
          </p>
        ) : null}
      </div>
      {open ? <ResumeLightbox src={src} onClose={close} /> : null}
    </>
  );
}
