import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
import SearchWithTwin from '@/components/site/SearchWithTwin';
import { DevMode } from '@/components/site/DevMode';
import { ContextualNudge } from '@/components/site/ContextualNudge';
import { GameInvite } from '@/components/site/GameInvite';
import { KonamiEgg } from '@/components/site/KonamiEgg';
import { FinalEgg } from '@/components/site/FinalEgg';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const DESCRIPTION =
  'AI/ML engineer building production RAG systems, reinforcement-learning agents, and NLP. Explore the docs, chat with my AI twin, or play against a PPO agent.';

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-8.png', sizes: '8x8', type: 'image/png' },
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={display.variable}>
      <body className="flex min-h-screen flex-col">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: "<!-- Yes, this site has docs. You're reading them. -->",
          }}
        />
        <RootProvider
          theme={{
            defaultTheme: 'light',
            enableSystem: false,
            disableTransitionOnChange: true,
          }}
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
