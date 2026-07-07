export interface Release {
  version: string;
  title: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const CURRENT_VERSION = '0.6.1';

// The site's own version history, newest first, tracking the real commit
// milestones. Distinct from the career changelog (which frames experience as
// releases). Easter eggs are hinted at here, never spelled out.
export const RELEASES: Release[] = [
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
      'The documentation-style shell: notebook layout, a muted-gold accent, and first-class light and dark modes with a seamless switch.',
    ],
  },
  {
    version: '0.1.0',
    title: 'Scaffold',
    date: 'July 2026',
    added: ['Next.js, Fumadocs, and Tailwind, deployed on Vercel.'],
  },
];
