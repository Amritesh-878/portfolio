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
    // GitHub and the theme toggle are rendered as custom links sharing one icon
    // style so they stay even in size and shape; Fumadocs' own theme switch is
    // disabled in the docs layout so it isn't drawn twice.
    links: [
      { type: 'custom', children: <VersionBadge />, secondary: true },
      { type: 'custom', children: <GitHubLink />, secondary: true },
      { type: 'custom', children: <ThemeToggle />, secondary: true },
    ],
  };
}
