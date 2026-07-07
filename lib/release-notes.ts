export interface Release {
  version: string;
  title: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const CURRENT_VERSION = '0.6.0';

// The site's own version history, newest first. This is the portfolio evolving,
// distinct from the career changelog (which frames experience as releases).
export const RELEASES: Release[] = [
  {
    version: '0.6.0',
    title: 'Developer mode and architecture',
    date: 'July 2026',
    added: [
      'A hidden developer mode, unlocked by clicking my name ten times, with an internals dashboard of live latency, model params, and training charts.',
      'An architecture page with whole-system diagrams.',
      'The twin now deflects prompt-injection attempts in character.',
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
  },
  {
    version: '0.3.0',
    title: 'Content',
    date: 'July 2026',
    added: [
      'Project deep-dives, certifications, uses, research, and a working contact form.',
    ],
  },
  {
    version: '0.2.0',
    title: 'Design system',
    date: 'July 2026',
    added: [
      'The documentation-style shell: notebook layout, a muted-gold accent, and first-class light and dark modes.',
    ],
  },
  {
    version: '0.1.0',
    title: 'Scaffold',
    date: 'July 2026',
    added: ['Next.js, Fumadocs, and Tailwind, deployed on Vercel.'],
  },
];
