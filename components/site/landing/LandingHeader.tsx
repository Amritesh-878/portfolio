import Link from 'next/link';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';

import { SiteMark } from '@/components/site/SiteMark';
import { VersionBadge } from '@/components/site/VersionBadge';

const GITHUB_URL = 'https://github.com/Amritesh-878';

export function LandingHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b-2 bg-fd-background/85 backdrop-blur"
      style={{ borderColor: 'var(--nb-line)' }}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <SiteMark size={22} />
          <span
            data-dev-trigger
            className="dev-name font-display text-sm font-semibold text-fd-foreground"
          >
            Amritesh Praveen
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden sm:block">
            <VersionBadge />
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden font-mono text-xs text-fd-muted-foreground transition-colors hover:text-fd-primary sm:inline"
          >
            GitHub
          </a>
          <ThemeSwitch />
          <Link
            href="/introduction"
            className="rounded-full bg-fd-primary px-3.5 py-1.5 font-mono text-xs font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Docs →
          </Link>
        </nav>
      </div>
    </header>
  );
}
