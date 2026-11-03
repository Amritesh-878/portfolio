import { describe, expect, it } from 'vitest';

import {
  clampScale,
  focalScroll,
  MAX_SCALE,
  MIN_SCALE,
  pinchScale,
  renderPixelWidth,
  touchDistance,
  touchMidpoint,
  zoomBy,
} from './zoom';

describe('clampScale', () => {
  it('keeps the scale between fit and the ceiling', () => {
    expect(clampScale(0.2)).toBe(MIN_SCALE);
    expect(clampScale(12)).toBe(MAX_SCALE);
    expect(clampScale(2.5)).toBe(2.5);
  });

  it('falls back to fit when the maths went bad', () => {
    expect(clampScale(Number.NaN)).toBe(MIN_SCALE);
    expect(clampScale(Number.POSITIVE_INFINITY)).toBe(MIN_SCALE);
  });
});

describe('zoomBy', () => {
  it('multiplies and clamps', () => {
    expect(zoomBy(2, 1.5)).toBe(3);
    expect(zoomBy(4, 1.5)).toBe(MAX_SCALE);
    expect(zoomBy(1.2, 0.5)).toBe(MIN_SCALE);
  });
});

describe('pinchScale', () => {
  it('scales with the spread of the fingers', () => {
    expect(pinchScale(1, 100, 200)).toBe(2);
    expect(pinchScale(2, 200, 100)).toBe(1);
  });

  it('ignores a pinch that started with the fingers together', () => {
    expect(pinchScale(2, 0, 150)).toBe(2);
  });
});

describe('touch geometry', () => {
  it('measures the gap between two touches', () => {
    expect(
      touchDistance({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 4 }),
    ).toBe(5);
  });

  it('finds the point between two touches', () => {
    expect(
      touchMidpoint({ clientX: 10, clientY: 20 }, { clientX: 30, clientY: 60 }),
    ).toEqual({ x: 20, y: 40 });
  });
});

describe('focalScroll', () => {
  it('keeps the point under the fingers in place', () => {
    expect(focalScroll(100, 50, 1, 2)).toBe(250);
    expect(focalScroll(250, 50, 2, 1)).toBe(100);
  });

  it('never scrolls the page past its start', () => {
    expect(focalScroll(10, 50, 2, 1)).toBe(0);
  });

  it('leaves the offset alone when the old scale is unusable', () => {
    expect(focalScroll(42, 50, 0, 2)).toBe(42);
  });
});

describe('renderPixelWidth', () => {
  it('renders at device resolution while that stays affordable', () => {
    expect(renderPixelWidth(334, 3, 1.414)).toBe(1002);
  });

  it('caps the backing store on a deep zoom', () => {
    expect(renderPixelWidth(1670, 3, 1.414)).toBe(3363);
  });

  it('caps on total area for a very tall page', () => {
    expect(renderPixelWidth(1670, 3, 4)).toBe(2000);
  });

  it('always returns at least one pixel', () => {
    expect(renderPixelWidth(0, 3, 1.414)).toBe(1);
  });
});
