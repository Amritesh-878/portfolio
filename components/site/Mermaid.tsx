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
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && node) node.innerHTML = svg;
      } catch {
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
