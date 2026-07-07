import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { VersionBadge } from '@/components/site/VersionBadge';
import { CatMark } from '@/components/site/CatMark';
import { DevName } from '@/components/site/DevName';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { GitHubLink } from '@/components/site/nav-icons';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <CatMark size={32} />
          <DevName />
        </span>
      ),
    },
    // One custom link holds the whole action cluster so its spacing is ours, not
    // Fumadocs' wide gap-6 between separate nav items. GitHub and the toggle
    // share one icon style; Fumadocs' own theme switch is disabled in the docs
    // layout so it isn't drawn twice.
    links: [
      {
        type: 'custom',
        secondary: true,
        children: (
          <div className="flex items-center gap-2">
            <VersionBadge />
            <GitHubLink />
            <ThemeToggle />
          </div>
        ),
      },
    ],
  };
}
