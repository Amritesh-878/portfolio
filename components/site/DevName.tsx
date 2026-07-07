'use client';

import type { MouseEvent } from 'react';

// The name is the developer-mode trigger (ten clicks unlocks it). It often sits
// inside a home link (the landing header, the Fumadocs nav title), so cancel the
// anchor's navigation on click without stopping propagation, so the click still
// bubbles to the document-level DevMode counter. preventDefault is a no-op when
// the name is not inside a link.
export function DevName({ className }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
  };

  return (
    <span
      data-dev-trigger
      onClick={onClick}
      className={`dev-name${className ? ` ${className}` : ''}`}
    >
      Amritesh Praveen
    </span>
  );
}
