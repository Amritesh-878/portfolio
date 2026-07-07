'use client';

import type { MouseEvent } from 'react';

export function DevName({ className }: { className?: string }) {
  // Cancel the enclosing home link's navigation without stopping propagation, so
  // the click still reaches the document-level dev-mode counter.
  const onClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
  };

  return (
    <span
      data-dev-trigger
      onClick={onClick}
      className={`dev-name whitespace-nowrap${className ? ` ${className}` : ''}`}
    >
      Amritesh Praveen
    </span>
  );
}
