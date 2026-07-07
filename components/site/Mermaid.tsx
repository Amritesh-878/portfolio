'use client';

import { useEffect, useId, useRef, useState } from 'react';

function useIsDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () =>
      setDark(document.documentElement.classList.contains('dark'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function Mermaid({ chart }: { chart: string }) {
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const ref = useRef<HTMLDivElement>(null);
  const dark = useIsDark();

  useEffect(() => {
    let cancelled = false;
    const node = ref.current;
    if (!node) return;
    void (async () => {
      const { default: mermaid } = await import('mermaid');
      // Pull the site's own tokens so diagrams match the theme and flip with it.
      const css = getComputedStyle(document.documentElement);
      const v = (name: string, fallback: string) =>
        css.getPropertyValue(name).trim() || fallback;
      const primary = v('--color-fd-primary', '#e0a84a');
      const fg = v('--color-fd-foreground', dark ? '#ece7de' : '#1a1712');
      const muted = v('--color-fd-muted-foreground', '#8a8175');
      const card = v('--color-fd-card', dark ? '#211d17' : '#f2eee6');
      const border = v('--color-fd-border', dark ? '#3a352c' : '#ddd6c8');
      const bg = v('--color-fd-background', dark ? '#17140f' : '#f7f4ee');
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        themeVariables: {
          background: bg,
          primaryColor: card,
          primaryTextColor: fg,
          primaryBorderColor: primary,
          lineColor: muted,
          secondaryColor: card,
          tertiaryColor: bg,
          clusterBkg: 'transparent',
          clusterBorder: border,
          titleColor: primary,
          actorBkg: card,
          actorBorder: primary,
          actorTextColor: fg,
          signalColor: muted,
          signalTextColor: fg,
          labelBoxBkgColor: card,
          labelBoxBorderColor: border,
          labelTextColor: fg,
          loopTextColor: muted,
          noteBkgColor: bg,
          noteBorderColor: border,
          noteTextColor: muted,
        },
      });
      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && node) node.innerHTML = svg;
      } catch (err) {
        console.error('Mermaid failed to render diagram:', err);
        if (!cancelled && node) {
          node.textContent = 'Diagram failed to render.';
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, dark, id]);

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4">
      <div
        ref={ref}
        className="flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
      />
    </div>
  );
}
