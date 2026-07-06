import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { QuickstartCards } from '@/components/site/QuickstartCards';

describe('QuickstartCards', () => {
  const html = renderToStaticMarkup(<QuickstartCards />);

  it('links to the twin, the game, and the projects overview', () => {
    expect(html).toContain('href="/twin/chat"');
    expect(html).toContain('href="/projects/hunter-wumpus/play"');
    expect(html).toContain('href="/projects"');
  });

  it('renders exactly three cards', () => {
    const links = html.match(/<a /g) ?? [];
    expect(links).toHaveLength(3);
  });
});
