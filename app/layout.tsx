import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import SearchWithTwin from '@/components/site/SearchWithTwin';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          theme={{ disableTransitionOnChange: true }}
          search={{ SearchDialog: SearchWithTwin }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
