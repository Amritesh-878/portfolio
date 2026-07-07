import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import SearchWithTwin from '@/components/site/SearchWithTwin';
import { DevMode } from '@/components/site/DevMode';
import { ContextualNudge } from '@/components/site/ContextualNudge';
import { GameInvite } from '@/components/site/GameInvite';
import { KonamiEgg } from '@/components/site/KonamiEgg';
import type { ReactNode } from 'react';

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
        <Analytics />
      </body>
    </html>
  );
}
