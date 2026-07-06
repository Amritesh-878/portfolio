'use client';

import { useEffect } from 'react';

/**
 * Tags `<html>` with `theme-changing` for the duration of a light/dark switch so
 * a single uniform colour transition can apply to every element at once. Scoping
 * it to the switch keeps normal hover transitions at their native speed.
 */
export function ThemeTransition() {
  useEffect(() => {
    const root = document.documentElement;
    let prevDark = root.classList.contains('dark');
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains('dark');
      if (isDark === prevDark) return;
      prevDark = isDark;

      root.classList.add('theme-changing');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('theme-changing'), 300);
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
