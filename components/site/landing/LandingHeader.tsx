import Link from 'next/link';

import { CatMark } from '@/components/site/CatMark';
import { DevName } from '@/components/site/DevName';
import { VersionBadge } from '@/components/site/VersionBadge';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { GitHubLink } from '@/components/site/nav-icons';

export function LandingHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b-2 bg-fd-background/85 backdrop-blur"
      style={{ borderColor: 'var(--nb-line)' }}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Home" className="flex items-center">
            <CatMark size={38} />
          </Link>
          <DevName className="font-display text-sm font-semibold text-fd-foreground" />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="mr-1 hidden sm:block">
            <VersionBadge />
          </div>
          <GitHubLink />
          <ThemeToggle />
          <Link
            href="/introduction"
            className="ml-1 rounded-full bg-fd-primary px-3.5 py-1.5 font-mono text-xs font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Docs →
          </Link>
        </nav>
      </div>
    </header>
  );
}
