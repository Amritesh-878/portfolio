import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { VersionBadge } from '@/components/site/VersionBadge';

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      sidebar={{ collapsible: false, footer: <VersionBadge /> }}
      tree={source.getPageTree()}
    >
      {children}
    </DocsLayout>
  );
}
