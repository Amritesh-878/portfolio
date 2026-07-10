export interface Release {
  version: string;
  title: string;
  date: string;
  pinned?: boolean;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const CURRENT_VERSION = '1.2.0';

export const RELEASES: Release[] = [
  {
    version: '1.2.0',
    title: 'Take your pick',
    date: 'July 2026',
    added: [
      "A model picker next to the ask button. My own fine-tuned model is on the list, greyed out until it's done training.",
    ],
    changed: [
      'The chat fits the screen now instead of asking you to scroll to reach the input.',
    ],
  },
  {
    version: '1.1.0',
    title: 'Harder to kill',
    date: 'July 2026',
    added: [
      'Architecture grew from one page into four: the site, the twin, the game backend, and the contact pipeline each get their own.',
      'The twin is wired for a self-hosted fallback model, for the day every free tier runs dry at once.',
    ],
    changed: [
      'Newer Gemini models behind the chat, and keyword-only retrieval keeps answers coming even when embeddings are down.',
    ],
  },
  {
    version: '1.0.0',
    title: 'A front door',
    date: 'July 2026',
    added: [
      'A landing page that sums up the work in about thirty seconds, then hands you three ways in.',
      'A guided walkthrough for Hunter Wumpus, so the game can teach itself before it turns on you.',
    ],
    changed: [
      'A warmer, boxier palette across the whole site, with the docs now living behind the landing at /introduction.',
      'The mark in the corner is a cat now.',
    ],
  },
  {
    version: '0.7.1',
    title: 'For the completionists',
    date: 'July 2026',
    pinned: true,
    added: ['A final easter egg, for people with far too much free time.'],
  },
  {
    version: '0.7.0',
    title: 'Findable, and a little more hidden',
    date: 'July 2026',
    added: [
      'Proper link previews: an Open Graph card, a sitemap, and a robots file, so the site looks right when shared or searched.',
      'More things tucked away for people who look. Still, on principle, not listed here.',
    ],
    changed: [
      "The diagrams now follow the site's own palette instead of stock colors.",
      'The Uses page is now Toolkit, and the version badge moved up to the top bar.',
    ],
  },
  {
    version: '0.6.1',
    title: 'Polish',
    date: 'July 2026',
    added: [
      'A fuller account of what I build full-time, and a line on what I actually believe.',
    ],
    changed: [
      'The architecture diagrams now use the right shape for each idea, the game board has room to breathe, and the on-page nudges are calmer and rarer.',
    ],
    fixed: [
      'The game now finds its backend by default, so it plays even without extra configuration.',
    ],
  },
  {
    version: '0.6.0',
    title: 'Architecture, and a few secrets',
    date: 'July 2026',
    added: [
      'An architecture page with whole-system diagrams of how the site, the twin, and the game fit together.',
      'A handful of things for the curious, left where they belong and deliberately not listed here. Poke around.',
    ],
    fixed: ['Duplicated subtitles on the changelog and chat pages.'],
  },
  {
    version: '0.5.0',
    title: 'Hunter Wumpus, playable',
    date: 'July 2026',
    added: [
      'The PPO reinforcement-learning game, embedded natively in the page rather than an iframe.',
      'A FastAPI and PPO backend running on a free Hugging Face Space.',
    ],
  },
  {
    version: '0.4.0',
    title: 'The AI twin',
    date: 'July 2026',
    added: [
      'A retrieval-grounded chatbot with a visible retrieval trace for every answer.',
      'Search hands unanswered queries to the twin from the command palette.',
    ],
    changed: [
      'Chat moved to its own full-page view, with a starter-question landing.',
    ],
  },
  {
    version: '0.3.0',
    title: 'Content',
    date: 'July 2026',
    added: [
      'Project deep-dives, a certifications wall, uses, research, and a working contact form.',
    ],
    changed: [
      'Projects and Hunter Wumpus are clickable from the breadcrumb and sidebar; certificates ordered by theme.',
    ],
  },
  {
    version: '0.2.0',
    title: 'Design system',
    date: 'July 2026',
    added: [
      'The documentation-style shell: notebook layout, a muted-gold accent, and first-class light and dark modes with an instant switch.',
    ],
  },
  {
    version: '0.1.0',
    title: 'Scaffold',
    date: 'July 2026',
    added: ['Next.js, Fumadocs, and Tailwind, deployed on Vercel.'],
  },
];
