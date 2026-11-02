'use client';

import { useEffect, useRef, useState } from 'react';

const PHONE_QUERY = '(max-width: 639px)';
const WORKER_SRC = '/pdf.worker.min.mjs';

type Status = 'idle' | 'rendering' | 'ready' | 'failed';

export function ResumePages({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('idle');

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
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        for (let number = 1; number <= doc.numPages; number += 1) {
          if (cancelled) break;
          const page = await doc.getPage(number);
          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: (width * ratio) / unscaled.width,
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
    <div className="mt-4 sm:hidden">
      <div ref={containerRef} className="flex flex-col gap-3" />
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
  );
}
