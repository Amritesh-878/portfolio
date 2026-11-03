'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import { ResumeStage } from '@/lib/resume/stage';
import {
  clampScale,
  DOUBLE_TAP_SCALE,
  focalScroll,
  MIN_SCALE,
  pinchScale,
  touchDistance,
  touchMidpoint,
  ZOOM_STEP,
  zoomBy,
} from '@/lib/resume/zoom';

const REDRAW_DELAY_MS = 160;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SLOP_PX = 30;
const FOCUSABLE = 'button, [tabindex="0"]';

const CONTROL_CLASS =
  'rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 font-mono text-xs text-neutral-100 transition-colors hover:border-neutral-500 disabled:opacity-40';

type Status = 'rendering' | 'ready' | 'failed';

export function ResumeLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<ResumeStage | null>(null);
  const scaleRef = useRef(MIN_SCALE);
  const focalRef = useRef<{ x: number; y: number } | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const lastTapRef = useRef<{ at: number; x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const [scale, setScale] = useState(MIN_SCALE);
  const [status, setStatus] = useState<Status>('rendering');

  useEffect(() => {
    const host = hostRef.current;
    const scroll = scrollRef.current;
    if (!host || !scroll) return;

    let cancelled = false;
    const stage = new ResumeStage(host);
    stageRef.current = stage;
    stage.load(src, scroll.clientWidth).then(
      () => {
        if (!cancelled) setStatus('ready');
      },
      () => {
        if (!cancelled) setStatus('failed');
      },
    );

    return () => {
      cancelled = true;
      stageRef.current = null;
      stage.destroy();
    };
  }, [src]);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const stage = stageRef.current;
    const from = scaleRef.current;
    scaleRef.current = scale;
    if (!scroll || !stage) return;

    stage.applyScale(scale);
    const focal = focalRef.current ?? {
      x: scroll.clientWidth / 2,
      y: scroll.clientHeight / 2,
    };
    focalRef.current = null;
    scroll.scrollLeft = focalScroll(scroll.scrollLeft, focal.x, from, scale);
    scroll.scrollTop = focalScroll(scroll.scrollTop, focal.y, from, scale);

    const timer = setTimeout(() => void stage.redraw(scale), REDRAW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [scale]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    return () => opener?.focus();
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const onResize = () => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.setFitWidth(scroll.clientWidth);
      void stage.redraw(scaleRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const focalFrom = (x: number, y: number) => {
      const rect = scroll.getBoundingClientRect();
      focalRef.current = { x: x - rect.left, y: y - rect.top };
    };

    const onTouchStart = (event: TouchEvent) => {
      movedRef.current = false;
      if (event.touches.length !== 2) return;
      pinchRef.current = {
        distance: touchDistance(event.touches[0], event.touches[1]),
        scale: scaleRef.current,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      movedRef.current = true;
      const pinch = pinchRef.current;
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const midpoint = touchMidpoint(event.touches[0], event.touches[1]);
      focalFrom(midpoint.x, midpoint.y);
      setScale(
        pinchScale(
          pinch.scale,
          pinch.distance,
          touchDistance(event.touches[0], event.touches[1]),
        ),
      );
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (pinchRef.current) {
        pinchRef.current = null;
        return;
      }
      if (event.touches.length > 0 || movedRef.current) return;
      const touch = event.changedTouches[0];
      const previous = lastTapRef.current;
      const at = Date.now();
      lastTapRef.current = { at, x: touch.clientX, y: touch.clientY };
      if (!previous || at - previous.at > DOUBLE_TAP_MS) return;
      if (
        Math.hypot(touch.clientX - previous.x, touch.clientY - previous.y) >
        DOUBLE_TAP_SLOP_PX
      ) {
        return;
      }
      lastTapRef.current = null;
      // A double tap also arrives as a click, which would otherwise read as a backdrop tap.
      movedRef.current = true;
      focalFrom(touch.clientX, touch.clientY);
      setScale((current) =>
        current > MIN_SCALE ? MIN_SCALE : clampScale(DOUBLE_TAP_SCALE),
      );
    };

    scroll.addEventListener('touchstart', onTouchStart, { passive: true });
    scroll.addEventListener('touchmove', onTouchMove, { passive: false });
    scroll.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      scroll.removeEventListener('touchstart', onTouchStart);
      scroll.removeEventListener('touchmove', onTouchMove);
      scroll.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const onBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (movedRef.current) return;
    if (event.target instanceof HTMLCanvasElement) return;
    onClose();
  };

  useEffect(() => {
    // Escape has to work even once focus has drifted to the page body behind a tapped canvas.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === '+' || event.key === '=') {
        setScale((current) => zoomBy(current, ZOOM_STEP));
        return;
      }
      if (event.key === '-') {
        setScale((current) => zoomBy(current, 1 / ZOOM_STEP));
        return;
      }
      if (event.key === '0') {
        setScale(MIN_SCALE);
        return;
      }
      if (event.key !== 'Tab') return;
      const stops = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!stops || stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Résumé of Amritesh Praveen, full screen"
      className="fixed inset-0 z-[120] flex flex-col bg-neutral-950"
    >
      <div className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900 px-3 py-2">
        <span className="font-mono text-xs text-neutral-400">
          {Math.round(scale * 100)}%
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={scale <= MIN_SCALE}
            onClick={() =>
              setScale((current) => zoomBy(current, 1 / ZOOM_STEP))
            }
            className={CONTROL_CLASS}
          >
            &minus;
          </button>
          <button
            type="button"
            onClick={() => setScale(MIN_SCALE)}
            className={CONTROL_CLASS}
          >
            fit
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setScale((current) => zoomBy(current, ZOOM_STEP))}
            className={CONTROL_CLASS}
          >
            +
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={CONTROL_CLASS}
          >
            close
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        tabIndex={0}
        role="group"
        aria-label="Résumé pages, pinch or use the arrow keys to move around"
        onClick={onBackdropClick}
        style={{ touchAction: 'pan-x pan-y' }}
        className="flex-1 overflow-auto overscroll-contain"
      >
        <div
          ref={hostRef}
          className="flex w-max min-w-full flex-col gap-3 py-3"
        />
        {status !== 'ready' ? (
          <p className="px-3 pb-3 font-mono text-xs text-neutral-400">
            {status === 'rendering'
              ? 'Drawing the pages.'
              : 'The pages would not draw on this browser, so open the PDF instead.'}
          </p>
        ) : null}
      </div>
    </div>
  );
}
