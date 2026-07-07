import Link from 'next/link';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';

import { CatMark } from '@/components/site/CatMark';
import { DevName } from '@/components/site/DevName';
import { VersionBadge } from '@/components/site/VersionBadge';

const GITHUB_URL = 'https://github.com/Amritesh-878';

// Placeholder GitHub glyph until the user supplies the SVG they want.
const GitHubIcon = (
  <svg
    viewBox="0 0 16 16"
    width={17}
    height={17}
    fill="currentColor"
    aria-hidden
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

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

        <nav className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <VersionBadge />
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-fd-muted-foreground transition-colors hover:text-fd-primary"
          >
            {GitHubIcon}
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
