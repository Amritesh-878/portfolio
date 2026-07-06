'use client';

import { useRouter } from 'next/navigation';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

export default function SearchWithTwin(props: SharedProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ locale }),
  });

  const askTwin = () => {
    const trimmed = search.trim();
    props.onOpenChange(false);
    router.push(
      trimmed ? `/twin/chat?q=${encodeURIComponent(trimmed)}` : '/twin/chat',
    );
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
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
      <SearchDialogFooter>
        <button
          type="button"
          onClick={askTwin}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <span className="truncate">
            {search.trim()
              ? `Ask my AI twin about "${search.trim()}"`
              : 'Ask my AI twin instead'}
          </span>
          <span className="ml-auto shrink-0 font-mono text-xs">→</span>
        </button>
      </SearchDialogFooter>
    </SearchDialog>
  );
}
