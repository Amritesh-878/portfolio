'use client';

import { useSyncExternalStore } from 'react';

export const DEV_MODE_KEY = 'portfolio-dev-mode';
export const DEV_MODE_EVENT = 'portfolio-dev-mode-change';

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DEV_MODE_KEY) === 'on';
}

export function setDevMode(on: boolean): void {
  if (typeof window === 'undefined') return;
  if (on) {
    window.localStorage.setItem(DEV_MODE_KEY, 'on');
  } else {
    window.localStorage.removeItem(DEV_MODE_KEY);
  }
  window.dispatchEvent(new CustomEvent(DEV_MODE_EVENT, { detail: on }));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(DEV_MODE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(DEV_MODE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function useDevMode(): boolean {
  return useSyncExternalStore(subscribe, isDevMode, () => false);
}
