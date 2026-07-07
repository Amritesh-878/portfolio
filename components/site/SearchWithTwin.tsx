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

const COMMANDS = [
  {
    keyword: 'play',
    label: 'Hunter Wumpus, playable',
    href: '/projects/hunter-wumpus/play',
  },
  { keyword: 'twin', label: 'ask the AI twin', href: '/twin/chat' },
  { keyword: 'hire', label: 'get in touch', href: '/contact' },
  {
    keyword: 'wumpus',
    label: 'how the Wumpus was trained',
    href: '/projects/hunter-wumpus',
  },
];

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

  // Typing "&gt;" turns the palette into a command menu (&gt; play, &gt; twin, ...).
  const commandQuery = trimmed.startsWith('>')
    ? trimmed.slice(1).trim().toLowerCase()
    : null;
  const commandItems: SearchItemType[] =
    commandQuery === null
      ? []
      : COMMANDS.filter((command) =>
          command.keyword.startsWith(commandQuery),
        ).map((command) => ({
          id: `cmd-${command.keyword}`,
          type: 'action',
          node: (
            <span className="flex items-center gap-2">
              <span className="font-mono text-fd-primary">
                &gt; {command.keyword}
              </span>
              <span className="text-fd-muted-foreground">{command.label}</span>
            </span>
          ),
          onSelect: () => router.push(command.href),
        }));

  const items = commandQuery !== null ? commandItems : [...results, askTwin];

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
        <SearchDialogList items={items} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
