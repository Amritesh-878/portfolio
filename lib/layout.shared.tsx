import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { VersionBadge } from '@/components/site/VersionBadge';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span data-dev-trigger>Amritesh Praveen</span>,
    },
    links: [{ type: 'custom', children: <VersionBadge />, secondary: true }],
    githubUrl: 'https://github.com/Amritesh-878',
  };
}
