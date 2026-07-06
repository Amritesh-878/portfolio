import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { ThemeTransition } from '@/components/site/ThemeTransition';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider theme={{ disableTransitionOnChange: false }}>
          <ThemeTransition />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
