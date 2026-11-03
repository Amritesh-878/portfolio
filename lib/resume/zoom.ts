export const MIN_SCALE = 1;
export const MAX_SCALE = 5;
export const DOUBLE_TAP_SCALE = 2.5;
export const ZOOM_STEP = 1.5;

// A phone browser drops a canvas with too big a backing store, so past these a deeper zoom stretches pixels instead of gaining them.
const MAX_PIXEL_WIDTH = 4000;
const MAX_PIXEL_AREA = 16_000_000;

type Point = { clientX: number; clientY: number };

export function clampScale(scale: number): number {
  if (!Number.isFinite(scale)) return MIN_SCALE;
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
}

export function zoomBy(scale: number, factor: number): number {
  return clampScale(scale * factor);
}

export function pinchScale(
  startScale: number,
  startDistance: number,
  distance: number,
): number {
  if (startDistance <= 0) return clampScale(startScale);
  return clampScale((startScale * distance) / startDistance);
}

export function touchDistance(a: Point, b: Point): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export function touchMidpoint(a: Point, b: Point): { x: number; y: number } {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  };
}

export function focalScroll(
  offset: number,
  focal: number,
  from: number,
  to: number,
): number {
  if (from <= 0) return offset;
  return Math.max(((offset + focal) * to) / from - focal, 0);
}

export function renderPixelWidth(
  cssWidth: number,
  ratio: number,
  aspect: number,
): number {
  const wanted = cssWidth * ratio;
  const areaLimit =
    aspect > 0 ? Math.sqrt(MAX_PIXEL_AREA / aspect) : MAX_PIXEL_WIDTH;
  return Math.max(Math.floor(Math.min(wanted, MAX_PIXEL_WIDTH, areaLimit)), 1);
}
