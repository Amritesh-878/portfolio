'use client';

import { useRouter } from 'next/navigation';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

export default function SearchWithTwin(props: SharedProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ locale }),
  });

  const trimmed = search.trim();
  const results = Array.isArray(query.data) ? query.data : [];
  const askTwin: SearchItemType = {
    id: 'ask-ai-twin',
    type: 'action',
    node: (
      <span className="flex items-center gap-2 text-fd-primary">
        {trimmed ? `Ask my AI twin about "${trimmed}"` : 'Ask my AI twin'}
        <span className="ml-auto font-mono text-xs">→</span>
      </span>
    ),
    onSelect: () => {
      router.push(
        trimmed ? `/twin/chat?q=${encodeURIComponent(trimmed)}` : '/twin/chat',
      );
    },
  };

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={[...results, askTwin]} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
