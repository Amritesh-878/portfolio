import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { alreadyInvited, markInvited } from './invite';

describe('invite flag', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
      },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is false until marked, then true', () => {
    expect(alreadyInvited()).toBe(false);
    markInvited();
    expect(alreadyInvited()).toBe(true);
  });
});
