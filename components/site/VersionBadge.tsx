import Link from 'next/link';

import { CURRENT_VERSION } from '@/lib/release-notes';

export function VersionBadge() {
  return (
    <Link
      href="/release-notes"
      className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-2.5 py-1 font-mono text-xs text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-primary"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-fd-primary/70" />
      v{CURRENT_VERSION}
    </Link>
  );
}
