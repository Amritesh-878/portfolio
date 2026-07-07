import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import SearchWithTwin from '@/components/site/SearchWithTwin';
import { DevMode } from '@/components/site/DevMode';
import { ContextualNudge } from '@/components/site/ContextualNudge';
import { GameInvite } from '@/components/site/GameInvite';
import { KonamiEgg } from '@/components/site/KonamiEgg';
import { FinalEgg } from '@/components/site/FinalEgg';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const DESCRIPTION =
  'AI/ML engineer building RAG systems, reinforcement-learning agents, and NLP. A documentation-style portfolio with a retrieval-grounded AI twin and a playable PPO game.';

export const metadata: Metadata = {
  metadataBase: new URL('https://amritesh.net'),
  title: {
    default: 'Amritesh Praveen',
    template: '%s · Amritesh Praveen',
  },
  description: DESCRIPTION,
  openGraph: {
    title: 'Amritesh Praveen',
    description: DESCRIPTION,
    url: '/',
    siteName: 'Amritesh Praveen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amritesh Praveen',
    description: 'AI/ML engineer. RAG, reinforcement learning, NLP.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: "<!-- Yes, this site has docs. You're reading them. -->",
          }}
        />
        <RootProvider
          theme={{ disableTransitionOnChange: true }}
          search={{ SearchDialog: SearchWithTwin }}
        >
          {children}
        </RootProvider>
        <DevMode />
        <ContextualNudge />
        <GameInvite />
        <KonamiEgg />
        <FinalEgg />
        <Analytics />
      </body>
    </html>
  );
}
