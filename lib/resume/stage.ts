import type {
  PDFDocumentLoadingTask,
  PDFPageProxy,
  RenderTask,
} from 'pdfjs-dist';

import { renderPixelWidth } from './zoom';

const WORKER_SRC = '/pdf.worker.min.mjs';
const MAX_DEVICE_RATIO = 3;
const PIXEL_TOLERANCE = 8;

type StagePage = {
  page: PDFPageProxy;
  canvas: HTMLCanvasElement;
  unscaledWidth: number;
  aspect: number;
  task: RenderTask | null;
};

export class ResumeStage {
  private readonly host: HTMLElement;
  private readonly pages: StagePage[] = [];
  private loader: PDFDocumentLoadingTask | null = null;
  private fitWidth = 0;
  private scale = 1;
  private token = 0;
  private destroyed = false;

  constructor(host: HTMLElement) {
    this.host = host;
  }

  async load(src: string, fitWidth: number): Promise<void> {
    this.fitWidth = fitWidth;
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
    const loader = pdfjs.getDocument({ url: src });
    this.loader = loader;
    const doc = await loader.promise;
    if (this.destroyed) return;
    for (let number = 1; number <= doc.numPages; number += 1) {
      const page = await doc.getPage(number);
      if (this.destroyed) return;
      const unscaled = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.className = 'block bg-white';
      canvas.setAttribute(
        'aria-label',
        `Résumé of Amritesh Praveen, page ${number}`,
      );
      this.host.append(canvas);
      this.pages.push({
        page,
        canvas,
        unscaledWidth: unscaled.width,
        aspect: unscaled.height / unscaled.width,
        task: null,
      });
    }
    this.applyScale(this.scale);
    await this.redraw(this.scale);
  }

  setFitWidth(width: number): void {
    this.fitWidth = width;
    this.applyScale(this.scale);
  }

  applyScale(scale: number): void {
    this.scale = scale;
    for (const entry of this.pages) {
      entry.canvas.style.width = `${this.fitWidth * scale}px`;
      entry.canvas.style.height = 'auto';
    }
  }

  async redraw(scale: number): Promise<void> {
    const token = (this.token += 1);
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_RATIO);
    for (const entry of this.pages) {
      if (token !== this.token || this.destroyed) return;
      const pixelWidth = renderPixelWidth(
        this.fitWidth * scale,
        ratio,
        entry.aspect,
      );
      if (Math.abs(entry.canvas.width - pixelWidth) < PIXEL_TOLERANCE) continue;
      const context = entry.canvas.getContext('2d');
      if (!context) continue;
      entry.task?.cancel();
      entry.task = null;
      const viewport = entry.page.getViewport({
        scale: pixelWidth / entry.unscaledWidth,
      });
      entry.canvas.width = viewport.width;
      entry.canvas.height = viewport.height;
      const task = entry.page.render({
        canvas: entry.canvas,
        canvasContext: context,
        viewport,
      });
      entry.task = task;
      try {
        await task.promise;
      } catch {
        return;
      }
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.token += 1;
    for (const entry of this.pages) {
      entry.task?.cancel();
      entry.canvas.remove();
    }
    this.pages.length = 0;
    void this.loader?.destroy();
    this.loader = null;
  }
}
