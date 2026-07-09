import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { VersionBadge } from '@/components/site/VersionBadge';
import { CatMark } from '@/components/site/CatMark';
import { DevName } from '@/components/site/DevName';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { GitHubLink, LinkedInLink } from '@/components/site/nav-icons';

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
    links: [
      {
        type: 'custom',
        secondary: true,
        children: (
          <div className="flex items-center gap-2">
            <VersionBadge />
            <GitHubLink />
            <LinkedInLink />
            <ThemeToggle />
          </div>
        ),
      },
    ],
  };
}
